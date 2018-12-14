# -*- coding: utf-8 -*-

import json
import os
import datetime

from flask_login import UserMixin
from peewee import BooleanField, CharField, IntegerField, Model, MySQLDatabase, DateTimeField
from werkzeug.security import check_password_hash,generate_password_hash
from flask import current_app
from app import login_manager
from conf.config import config

cfg = config[os.getenv('FLASK_CONFIG') or 'default']

db = MySQLDatabase(host=cfg.DB_HOST, user=cfg.DB_USER, passwd=cfg.DB_PASSWD, database=cfg.DB_DATABASE)


class BaseModel(Model):
    class Meta:
        database = db

    def __str__(self):
        r = {}
        for k in self._data.keys():
            try:
                r[k] = str(getattr(self, k))
            except:
                r[k] = json.dumps(getattr(self, k))
        # return str(r)
        return json.dumps(r, ensure_ascii=False)


# 管理员与用户
class User(UserMixin, BaseModel):
    username = CharField(unique=True)  # 用户名
    password = CharField()  # 密码
    fullname = CharField(default='')  # 真实性名
    email = CharField(default='')  # 邮箱
    phone = CharField(default='')  # 电话
    level = IntegerField() # 权限
    status = BooleanField(default=True)  # 生效失效标识

    def verify_password(self, raw_password):
        return check_password_hash(self.password, raw_password)
    def generate_password(raw_password):
        return generate_password_hash(raw_password)


# 通知人配置
class CfgNotify(BaseModel):
    check_order = IntegerField()  # 排序
    notify_type = CharField()  # 通知类型：MAIL/SMS
    notify_name = CharField()  # 通知人姓名
    notify_number = CharField()  # 通知号码
    status = BooleanField(default=True)  # 生效失效标识

class Containers(BaseModel):
    user_id = IntegerField(unique=True) # 与用户对应ID
    container_name = CharField() # 容器名称
    container_id = CharField() # 容器ID
    container_status = BooleanField(default=False) # 容器状态
    create_time = DateTimeField(default=datetime.datetime.now)

class Images(BaseModel):
    image_id = CharField(unique=True) # 镜像ID
    image_name = CharField() # 镜像名
    image_description = CharField() # 镜像描述
    image_img = CharField(default='registry.png') # 镜像图片地址


@login_manager.user_loader
def load_user(user_id):
    return User.get(User.id == int(user_id))


# 建表
def create_table():
    db.connect()
    db.create_tables([CfgNotify, User, Containers,Images])


if __name__ == '__main__':
    create_table()
