from app import get_logger, get_config,sockets
import math
from flask import render_template, redirect, url_for, flash, request, jsonify
from flask_login import login_required, current_user
from flask_sockets import Sockets
from app import utils
from app.models import CfgNotify, User, Containers, Images
from app.main.forms import CfgNotifyForm, AddImageForm, AddContainerForm, UserForm
from . import main


import json
import docker
import subprocess
import uuid
import os
import re

logger = get_logger(__name__)
cfg = get_config()

# 通用列表查询
def common_list(DynamicModel, view):
    # 接收参数
    action = request.args.get('action')
    id = request.args.get('id')
    page = int(request.args.get('page')) if request.args.get('page') else 1
    length = int(request.args.get('length')) if request.args.get('length') else cfg.ITEMS_PER_PAGE

    # 删除操作
    if action == 'del' and id:
        try:
            DynamicModel.get(DynamicModel.id == id).delete_instance()
            flash('删除成功')
        except:
            flash('删除失败')

    # 查询列表
    query = DynamicModel.select()
    total_count = query.count()

    # 处理分页
    if page: query = query.paginate(page, length)

    dict = {'content': utils.query_to_list(query), 'total_count': total_count,
            'total_page': math.ceil(total_count / length), 'page': page, 'length': length}
    return render_template(view, form=dict, current_user=current_user)
    

def user_list(DynamicModel):
    return render_template('userlist.html', current_user=current_user)

# 通用单模型查询&新增&修改
def common_edit(DynamicModel, form, view):
    id = request.args.get('id', '')
    if id:
        # 查询
        model = DynamicModel.get(DynamicModel.id == id)
        if request.method == 'GET':
            utils.model_to_form(model, form)
        # 修改
        if request.method == 'POST':
            if form.validate_on_submit():
                utils.form_to_model(form, model)
                model.save()
                flash('修改成功')
            else:
                utils.flash_errors(form)
    else:
        # 新增
        if form.validate_on_submit():
            model = DynamicModel()
            utils.form_to_model(form, model)
            model.save()
            flash('保存成功')
        else:
            utils.flash_errors(form)
    return render_template(view, form=form, current_user=current_user)


# 根目录跳转
@main.route('/', methods=['GET'])
@login_required
def root():
    return redirect(url_for('main.index'))


# 首页
@main.route('/index', methods=['GET'])
@login_required
def index():
    return render_template('index.html', current_user=current_user)


# 通知方式查询
@main.route('/notifylist', methods=['GET', 'POST'])
@login_required
def notifylist():
    return common_list(CfgNotify, 'notifylist.html')


# 通知方式配置
@main.route('/notifyedit', methods=['GET', 'POST'])
@login_required
def notifyedit():
    return common_edit(CfgNotify, CfgNotifyForm(), 'notifyedit.html')

@main.route('/api/stats/summary',methods=['GET'])
@login_required
def summary():
    client = docker.from_env()
    if current_user.level == 1:
        containers_count = len(client.containers.list(all=True))
    else:
        try:
            containers_count = 0 
            containers = Containers.select().where(Containers.user_id == current_user.id)
            containers_count = containers.count()
        except Exception as e:
            print(e)
            containers_count = 0 
    images_count = len(client.images.list())
    try:
        child1 = subprocess.Popen(['cat','/proc/cpuinfo'],stdout=subprocess.PIPE)
        child2 = subprocess.Popen(['grep','processor'],stdin=child1.stdout,stdout=subprocess.PIPE)
        child3 = subprocess.Popen(['wc','-l'],stdin=child2.stdout,stdout=subprocess.PIPE)
        CPU_count = int(child3.communicate()[0].split()[0])
    except Exception as e:
        print(e)
        print('Linux commond is incomplete!')
        CPU_count = 'undefined'
    try:
        child = subprocess.Popen(['awk','($1 == "MemTotal:"){print $2/1048576}','/proc/meminfo'],stdout=subprocess.PIPE)
        MEM_count = round(float(child.communicate()[0].split()[0]),2)
    except Exception as e:
        print('Linux commond is incomplete!')
        MEM_count = 'undefined'
    try:
        child = subprocess.Popen(['uname','-a'],stdout=subprocess.PIPE)
        system = str(child.communicate()[0])[2:-3]
    except Exception as e:
        print('Linux commond is incomplete!')
        system = 'undefined'
    jsOutObj = {}
    jsOutObj["containers_count"] = containers_count
    jsOutObj["images_count"] = images_count
    jsOutObj["CPU_count"] = CPU_count
    jsOutObj["MEM_count"] = MEM_count
    jsOutObj["system"] = system
    return jsonify(jsOutObj)

@main.route('/image_look/',methods=['GET', 'POST'])
@login_required
def image_look():
    action = request.values.get('action')
    id = request.values.get('id')
    page = int(request.args.get('page')) if request.args.get('page') else 1
    length = int(request.args.get('length')) if request.args.get('length') else cfg.ITEMS_PER_PAGE
    form = AddImageForm()
    # 添加镜像
    temp_image_name = str(uuid.uuid1())
    try:
        file = request.files['image_file']
        image_img = file.filename
        image_img = temp_image_name+'.jpg'
        file.save(os.path.join('app/static/im_image',image_img))
    except Exception as e:
        image_img = 'registry.png'
    if action == 'add':
        form = AddImageForm(request.form)
        if form.validate():
            image_name = form.image_name.data
            image_id = form.image_id.data
            image_description = form.image_description.data
            image = Images.insert(image_id=image_id,image_name=image_name,image_description=image_description,image_img=image_img).execute()
            return jsonify({'message':'添加成功',
                            'code':200,
                            })
        else:
            return jsonify({'message':'添加失败',
                            'code':400})
    # 删除镜像
    if action == 'del' and id:
        try:
            Images.get(Images.id == id).delete_instance()
            return jsonify({'message':'添加成功',
                            'code':200,
                            })
        except:
            return jsonify({'message':'添加失败',
                            'code':400})

    query = Images.select()
    total_count = query.count()

    if page: query = query.paginate(page, length)
    dict = {'content': query, 'total_count': total_count,
            'total_page': math.ceil(total_count / length), 'page': page, 'length': length,'csrf_token':form.csrf_token}

    return render_template('imagelist.html',current_user=current_user,form=dict)

@main.route('/image_deploy/',methods=['GET','POST'])
@login_required
def image_deploy():
    action = request.values.get('action')

    container_name = request.values.get('container_name')
    image_id = request.values.get('container_id')
    port_map = request.values.get('port_map')
    container_command = request.values.get('container_command')
    container_entrypoint = request.values.get('container_entrypoint')
    container_workingdir = request.values.get('container_workingdir')
    container_user = request.values.get('container_user')
    container_time = request.values.get('container_time')

    if action == 'deploy':
        try:
            # 条件判断
            assert container_name != '','请输入容器名称'
            assert image_id != '','请输入镜像ID'
            client = docker.from_env()
            ports = {}
            port_map = json.loads(port_map)
            if port_map != []:
                for i in port_map:
                    if(i[0] == '' or i[1] == '' or i[2] == '' ):
                        continue
                    assert len(i[0].split(':')) == 2 or i[0].isnumeric(),'宿主机映射格式不正确'
                    assert i[1].isnumeric(),'容器映射格式不正确'
                    assert i[2] == 'TCP' or i[2] == 'UDP','协议格式不正确'
                    if len(i[0].split(':')) == 2:
                        (hip,hport) = len(i[0].split(':'))
                        assert re.match('^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$',hip) == True,'宿主机IP格式不正确'
                        assert hport.isnumeric(),'宿主机端口格式不正确'
                        ports[i[1]+'/'+i[2]] =  (hip,int(hport))
                    else:
                        ports[i[1]+'/'+i[2]] =  int(i[0])
            con = client.containers.run(image=image_id,command=container_command,auto_remove=True,
            detach=True,entrypoint=container_entrypoint,name=container_name,ports=ports,
            user=container_user,working_dir=container_workingdir,remove=True)

            # 部署成功后入库
            user_id = current_user.id
            container_name = container_name
            container_id = con.id
            container_status = 1
            image = Containers.insert(user_id=user_id,container_name=container_name,container_id=container_id,container_status=container_status).execute()
            return jsonify({'message':container_name+' 部署成功',
                            'code':200,
                            })
        except Exception as e:
            return jsonify({'message':'部署失败,'+str(e),
                            'code':400})
    query = Images.select()
    total_count = query.count()
    form = AddContainerForm()
    dict = {'content': query, 'total_count': total_count,'csrf_token':form.csrf_token}

    action = request.values.get('container_name')
    
    return render_template('imagedeploy.html',current_user=current_user,form=dict)

@main.route('/container_look', methods=['GET', 'POST'])
@login_required
def container_look():
    client = docker.from_env()
    # check
    real_containers = client.containers.list(all=True)
    virtual_containers = Containers.select()
    real_pool = []
    for real_container in real_containers:
        real_pool.append(real_container.id)
    for virtual_container in virtual_containers:
        if virtual_container.container_id not in real_pool:
            Containers.update(container_status=0).where(Containers.container_id==virtual_container.container_id).execute()
        else:
            Containers.update(container_status=1).where(Containers.container_id==virtual_container.container_id).execute()
    if current_user.level == 1:
        containers = Containers.select()
        containers_count = containers.count()
    else:
        containers = Containers.select().where(Containers.user_id == current_user.id)
        containers_count = containers.count()
    form = AddContainerForm()
    dict = {"content":containers, "total_count":containers_count,'csrf_token':form.csrf_token}
    return render_template('containerlist.html',current_user=current_user,form=dict)

@main.route('/containers/<id>/<action>')
@login_required
def quick_action(id,action):
    if len(id) != 64:
        return "非法ID"
    if action == 'delete':
        client = docker.from_env()
        if Containers.get(Containers.container_id == id).container_status:
            client.containers.get(container_id=id).remove(force=True)
        Containers.get(Containers.container_id == id).delete_instance()
        delete_url = url_for('main.container_look')
        return redirect(delete_url)
    if action == 'console':
        return render_template('console.html',current_user=current_user,id=id)
    if action == 'logs':
        client = docker.from_env()
        logs = client.containers.get(container_id=id).logs()
        return render_template('logs.html',current_user=current_user,logs=logs)
    if action == 'inspect':
        client = docker.from_env()
        inspect = client.api.inspect_container(container=id)
        inspect = json.dumps(inspect)
        return render_template('inspect.html',current_user=current_user,inspect=inspect)

@sockets.route('/container')
def console_socket(ws):
    id = request.values.get('id')
    if len(id) != 64:
        return "非法ID"
    dockerCli = utils.ClientHandler(base_url='unix://var/run/docker.sock', timeout=10)
    terminalExecId = dockerCli.creatTerminalExec(id)
    terminalStream = dockerCli.startTerminalExec(terminalExecId)._sock

    terminalThread = utils.DockerStreamThread(ws, terminalStream)
    terminalThread.start()
    beat_thread = utils.BeatWS(ws, dockerCli.client)
    beat_thread.start()

    try:
        while not ws.closed:
            message = ws.receive()
            if message is not None:
                sed_msg = bytes(message, encoding='utf-8')
                if sed_msg != b'__ping__':
                    terminalStream.send(bytes(message, encoding='utf-8'))
    except Exception as err:
        print(err)
    finally:
        ws.close()
        terminalStream.close()
        dockerCli.dockerClient.close()



@main.route('/user_manage', methods=['GET','POST'])
@login_required
def user_manage():
    form = UserForm()
    action = request.values.get('action')
    if current_user.level == 1:
        users = User.select().order_by('id')
        users_count = users.count()
        dict = {"content":users, "total_count":users_count,'csrf_token':form.csrf_token}
        try:
            if action == 'add':
                username = request.values.get('username')
                password = request.values.get('password')
                level = request.values.get('level')
                assert username != '','请输入用户名'
                assert password != '','请输入密码'
                password = User.generate_password(raw_password=password)
                is_user = User.select().where(User.username==username).first()
                assert is_user==None,'该用户已存在'
                user = User.insert(username=username,password=password,level=level).execute()
                return jsonify({'message':'用户添加成功',
                            'code':200,
                            })
        except Exception as e:
            return jsonify({'message':'用户添加失败,'+str(e),
                            'code':400})
        try:
            if action == 'delete':
                id = request.values.get('id')
                assert id != '','用户删除错误'
                assert id != '1','创始管理员不可删除'
                User.get(User.id == id).delete_instance()
                return jsonify({'message':'用户删除成功',
                            'code':200,
                            })
        except Exception as e:
            return jsonify({'message':'用户删除失败,'+str(e),
                            'code':400})
    else:
        dict = {'csrf_token':form.csrf_token}
    try:
        if action == 'update':
            new_password = request.values.get('new_password')
            assert new_password != '','请输入密码'
            password = User.generate_password(raw_password=new_password)
            user = User.update(password=password).where(User.id==current_user.id).execute()
            return jsonify({'message':'密码修改成功',
                        'code':200,
                        })
    except Exception as e:
        return jsonify({'message':'密码修改失败,'+str(e),
                        'code':400})
        
    return render_template('userlist.html', current_user=current_user,form=dict)
