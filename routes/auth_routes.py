from flask import Blueprint, render_template, request
from model.Users import Users

auth_db = Blueprint('auth', __name__)

@auth_db.route('/', methods=['GET'])
def login_form():
    return render_template('auth/index.html')


@auth_db.route('/', methods=['POST'])
def login():
    username = request.form.get('loginUsername')
    password = request.form.get('loginPassword')
    return f"Username: {username}, Password: {password}"

@auth_db.route('/sign-up', methods=['GET', 'POST'])
def signup():
    return render_template('auth/signup.html')
