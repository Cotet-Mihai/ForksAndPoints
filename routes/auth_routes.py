from flask import Blueprint, render_template, request
from model.Users import Users

auth_db = Blueprint('auth', __name__)

@auth_db.route('/', methods=['GET'])
def login_form():
    #return render_template('auth/base.html')
    users = Users.query.all()
    return render_template('auth/index.html', people=users)


@auth_db.route('/', methods=['POST'])
def login():
    username = request.form.get('InputUsername')
    password = request.form.get('InputPassword')
    return f"Username: {username}, Password: {password}"