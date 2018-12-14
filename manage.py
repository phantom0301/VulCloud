#!/usr/bin/env python3
import os
from app import create_app
from flask_script import Manager, Server

from gevent import pywsgi
from geventwebsocket.handler import WebSocketHandler

app = create_app(os.getenv('FLASK_CONFIG') or 'default')
#manager = Manager(app)

server = pywsgi.WSGIServer(listener=("0.0.0.0",5000), application=app, handler_class=WebSocketHandler)
#manager.add_command("runserver", server)


if __name__ == '__main__':
    server.serve_forever()
