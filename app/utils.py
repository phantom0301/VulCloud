# -*- coding: utf-8 -*-

import html
import json
import datetime
from urllib.parse import unquote
from app.models import CfgNotify,Images
from flask import Response, flash

import time
import docker
import threading
from socket import timeout
from io import BytesIO

## 字符串转字典
def str_to_dict(dict_str):
    if isinstance(dict_str, str) and dict_str != '':
        new_dict = json.loads(dict_str)
    else:
        new_dict = ""
    return new_dict


## URL解码
def urldecode(raw_str):
    return unquote(raw_str)


# HTML解码
def html_unescape(raw_str):
    return html.unescape(raw_str)


## 键值对字符串转JSON字符串
def kvstr_to_jsonstr(kvstr):
    kvstr = urldecode(kvstr)
    kvstr_list = kvstr.split('&')
    json_dict = {}
    for kvstr in kvstr_list:
        key = kvstr.split('=')[0]
        value = kvstr.split('=')[1]
        json_dict[key] = value
    json_str = json.dumps(json_dict, ensure_ascii=False, default=datetime_handler)
    return json_str


# 字典转对象
def dict_to_obj(dict, obj, exclude=None):
    for key in dict:
        if exclude:
            if key in exclude:
                continue
        setattr(obj, key, dict[key])
    return obj


# peewee转dict
def obj_to_dict(obj, exclude=None):
    dict = obj.__dict__['_data']
    if exclude:
        for key in exclude:
            if key in dict: dict.pop(key)
    return dict


# peewee转list
def query_to_list(query, exclude=None):
    list = []
    for obj in query:
        dict = obj_to_dict(obj, exclude)
        list.append(dict)
    return list


# 封装HTTP响应
def jsonresp(jsonobj=None, status=200, errinfo=None):
    if status >= 200 and status < 300:
        jsonstr = json.dumps(jsonobj, ensure_ascii=False, default=datetime_handler)
        return Response(jsonstr, mimetype='application/json', status=status)
    else:
        return Response('{"errinfo":"%s"}' % (errinfo,), mimetype='application/json', status=status)


# 通过名称获取PEEWEE模型
def get_model_by_name(model_name):
    if model_name == 'notifies':
        DynamicModel = CfgNotify
    else:
        DynamicModel = None
    return DynamicModel


# JSON中时间格式处理
def datetime_handler(x):
    if isinstance(x, datetime.datetime):
        return x.strftime("%Y-%m-%d %H:%M:%S")
    raise TypeError("Unknown type")


# wtf表单转peewee模型
def form_to_model(form, model):
    for wtf in form:
        model.__setattr__(wtf.name, wtf.data)
    return model


# peewee模型转表单
def model_to_form(model, form):
    dict = obj_to_dict(model)
    form_key_list = [k for k in form.__dict__]
    for k, v in dict.items():
        if k in form_key_list and v:
            field = form.__getitem__(k)
            field.data = v
            form.__setattr__(k, field)


def flash_errors(form):
    for field, errors in form.errors.items():
        for error in errors:
            flash("字段 [%s] 格式有误,错误原因: %s" % (
                getattr(form, field).label.text,
                error
            ))

class ClientHandler(object):

    def __init__(self, **kwargs):
        self.dockerClient = docker.APIClient(**kwargs)
    
    @property
    def client(self):
        return self.dockerClient

    def creatTerminalExec(self, containerId):
        execCommand = [
            "/bin/sh",
            "-c",
            'TERM=xterm-256color; export TERM; [ -x /bin/bash ] && ([ -x /usr/bin/script ] && /usr/bin/script -q -c "/bin/bash" /dev/null || exec /bin/bash) || exec /bin/sh'
        ]

        execOptions = {
            "tty": True,
            "stdin": True,
            "stdout": True
        }
        execId = self.dockerClient.exec_create(containerId, execCommand, **execOptions)
        return execId["Id"]

    def startTerminalExec(self, execId):
        return self.dockerClient.exec_start(execId, socket=True, tty=True)

class DockerStreamThread(threading.Thread):
    def __init__(self, ws, terminalStream):
        super(DockerStreamThread, self).__init__()
        self.ws = ws
        self.terminalStream = terminalStream

    def run(self):
        while not self.ws.closed:
            try:
                dockerStreamStdout = self.terminalStream.recv(2048)
                if dockerStreamStdout is not None:
                    self.ws.send(str(dockerStreamStdout, encoding='utf-8'))
                else:
                    print("docker daemon socket is close")
                    self.ws.close()
            except timeout:
                print('REceive from docker timeout.')
            except Exception as e:
                print("docker daemon socket err: %s" % e)
                self.ws.close()
                break

class BeatWS(threading.Thread):
    def __init__(self, ws, docker_client):
        super(BeatWS, self).__init__()
        self.ws = ws
        self.docker_client = docker_client

    def run(self):
        while not self.ws.closed:
            time.sleep(2)
            self.docker_client.ping()

def docker_build(image_name, text):
    f = BytesIO()
    f.write(text.encode('utf-8'))
    client = docker.from_env()
    _image,_log = client.images.build(fileobj=f)
    image_id = _image.id.split(':')[1]
    image_name = image_name
    image = Images.insert(image_id=image_id, image_name=image_name, image_description='').execute()
    _log = str(_log)
