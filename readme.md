# VulCloud
## 简介
VulCloud 是一个希望为 Vulhub 漏洞镜像提供友好的 Web-UI 可视化操作界面的 Web 应用。（主要是为了学习而造的轮子）整体使用 Flask 框架，通过调用 Docker API 提供镜像管理、容器部署、 Web-Console 容器操作以及多用户等功能。

希望能够提供一个方便快捷的 Web 应用，用于漏洞环境的管理和快速启动。  

1. 便捷的可视化操作界面
2. 定时漏洞容器销毁（coding）
3. Web-Console 一键进入容器
4. 镜像列表、容器列表直观呈现

## 系统截图
- 首页  
![](/img/1.jpg)

镜像、容器、宿主机资源可视化

- 镜像页  
![](/img/2.jpg)

镜像列表查看，镜像模板添加、部署、删除功能

- 镜像部署页
![](/img/3.jpg)

容器名称、镜像ID、端口映射选择、启动命令、定时销毁以及其他功能

- 容器页
![](/img/4.jpg)

容器列表查看、容器日志操作、容器Console操作、容器元数据查看

- 容器Console操作
![](/img/6.jpg)

Web界面一键进入容器内部

- 容器元数据操作
![](/img/7.jpg)

容器元数据查看

- 多用户权限管理
![](/img/8.jpg)


## 第三方依赖
- peewee
- pymysql
- flask
- flask-script
- flask-wtf
- flask-login
- flask-sockets
- docker
- gevent


## 环境配置
### Docker 环境安装配置

Docker 安装及加速推荐Daocloud

[http://get.daocloud.io/#install-docker](http://get.daocloud.io/#install-docker "http://get.daocloud.io/#install-docker")

### 本项目使用 Python3

### 第三方依赖安装
```
pip3 install -r requirements.txt

```
### 系统参数配置
1. 编辑`config.py`， 修改SECRET_KEY及MySQL数据库相关参数
```
SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-secret'
DB_HOST = '127.0.0.1'
DB_USER = 'foobar'
DB_PASSWD = 'foobar'
DB_DATABASE = 'foobar'
```

2. 编辑log-app.conf，修改日志路径
```
args=('/path/to/log/flask-rest-sample.log','a','utf8')
```

### 数据库初始化

0. 将model.py复制到项目根目录下

1. 自动建表
直接运行`python3 models.py`

2. 插入管理员用户（默认admin/admin)
```
INSERT INTO `user` (`id`, `username`, `password`, `fullname`, `email`, `phone`, `level`, `status`) VALUES (NULL, 'admin', 'pbkdf2:sha256:50000$29NRBqxe$be7ebc2e87a35eae61674ac9b386a7e924095b78b1d7a61d1be2225044303f0a', 'admin', 'admin@admin.com', '18612341234', '1', '1');
```

### 启动应用
```
python3 manage.py

&
(gunicorn 部署)
gunicorn -k flask_sockets.worker --workers=4 --bind=0.0.0.0:5000 manage:app
```


## 项目使用简介

### 镜像初始化导入

镜像导入主要由两部分构成：

1. 编译、构建或者拉取 Vulhub 或自己新建的镜像到宿主机。
2. 在宿主机上使用 docker images 查看对应镜像的ID
3. 访问 Vulhub-UI ——> 镜像仓库 ——> 镜像查询 ——> 添加镜像，在对应的弹框中填写对应的镜像信息
4. 这样，就完成了 Vulhub-UI 的镜像初始化，其他使用者就可以快速的在 Web 应用中选择需要启动的漏洞环境 

### 容器部署
1. 访问 Vulhub-UI ——> 镜像仓库 ——> 镜像部署，对照填写部署信息，注意镜像ID是必填项，可以直接在 “镜像ID” 中填写，也可以通过右侧 “镜像选择” 进行选择
2. 点击 “添加映射端口” 可以添加端口到宿主机的映射
3. 高级设置根据使用者的需求自行设置，注意定时销毁功能暂时未完成

### 容器查询及操作
1. 容器提供添加及删除服务，注意，本项目部署使用自动Remove，容器部署后可刷新查看同期状态，未部署成功或者容器停止均会使容器被完全删除
2. logs 选项可以查看容器部署后日志信息
3. console 选项可以直接进入容器内部执行命令行，注意，vim等操作会导致 console 断开
4. inspect 选项提供完整美观的容器元数据

### TodoList
- 更加稳定的 Web Console 实现
- 容器以及用户界面列表没有作分页
- 更加合适的容器启动方式，添加包括容器启动、停止、重新部署等多个操作
- 容器定时销毁机制
- 开放端口显示

### 更加久远的计划

- Volume 机制 （如何实现的更加安全）
- Network 机制
- 更加方便的镜像可视化生成方式 （Web Compose 功能？）
- 容器资源限制 （内存资源、CPU资源）
- 搜索框

## 项目构建者

- kssandyy （https://github.com/kssandyy）
- phantom0301 （https://github.com/phantom0301）



## 致谢
- 本项目基本框架参考 flask-adminlte-handler 项目
- 本项目部分UI参考 Portainer 项目
- 本项目 Web-console 功能参考 Web-terminal-docker

## BUG提交

直接issue提起来
