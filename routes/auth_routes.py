from flask import Blueprint, render_template, request

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/', methods=['GET'])
def login_form():
    return render_template('auth/index.html')

@auth_bp.route('/', methods=['POST'])
def login():
    username = request.form.get('username')
    password = request.form.get('password')
    return f"Username: {username}, Password: {password}"
