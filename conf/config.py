import os

basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
    DB_HOST = '127.0.0.1'
    DB_USER = 'root'
    DB_PASSWD = '123456'
    DB_DATABASE = 'VULCloud'
    ITEMS_PER_PAGE = 10
    JWT_AUTH_URL_RULE = '/api/auth'

    @staticmethod
    def init_app(app):
        pass


class DevelopmentConfig(Config):
    DEBUG = False


class TestingConfig(Config):
    TESTING = False


class ProductionConfig(Config):
    PRODUCTION = False


config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
