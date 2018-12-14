from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed, FileRequired
from wtforms import StringField, SubmitField, BooleanField, PasswordField, SelectField, TextAreaField, HiddenField,IntegerField
from wtforms.validators import DataRequired, Length, Email, Regexp, EqualTo


class CfgNotifyForm(FlaskForm):
    check_order = StringField('排序', validators=[DataRequired(message='不能为空'), Length(0, 64, message='长度不正确')])
    notify_type = SelectField('通知类型', choices=[('MAIL', '邮件通知'), ('SMS', '短信通知')],
                              validators=[DataRequired(message='不能为空'), Length(0, 64, message='长度不正确')])
    notify_name = StringField('通知人姓名', validators=[DataRequired(message='不能为空'), Length(0, 64, message='长度不正确')])
    notify_number = StringField('通知号码', validators=[DataRequired(message='不能为空'), Length(0, 64, message='长度不正确')])
    status = BooleanField('生效标识', default=True)
    submit = SubmitField('提交')

class AddImageForm(FlaskForm):
    image_name = StringField(validators=[DataRequired(message='请输入镜像名称')])
    image_id = StringField(validators=[DataRequired(message='请输入镜像ID')])
    image_description = StringField()
    image_img = StringField()
    image_file = FileField(validators=[FileAllowed(['jpg', 'png'], 'Images only!')])

class AddContainerForm(FlaskForm):
    container_name = StringField(validators=[DataRequired(message='请输入容器名称')])
    container_id = StringField()

class UserForm(FlaskForm):
    username = StringField(validators=[DataRequired(message='请输入用户名')])
    password = PasswordField(validators=[DataRequired(message='请输入密码')])
    fullname = StringField()
    email = StringField(validators=[Email("邮箱格式不正确")])
    phone = StringField()
    level = IntegerField()
    status= IntegerField()
    


