from flask import Blueprint, render_template, request
from services.auth_services import verify_login, create_new_user

auth_db = Blueprint('auth', __name__)


@auth_db.route('/', methods=['GET'])
def sign_in():
    return render_template('auth/index.html')


@auth_db.route('/', methods=['POST'])
def verify_sign_in():
    username = request.form.get('loginUsername')
    password = request.form.get('loginPassword')

    if verify_login(username, password):
        return f'Succes'

    else:
        # todo: Call front for show msg
        return f'Username or password incorect'




@auth_db.route('/sign-up', methods=['GET'])
def sign_up():
    return render_template('auth/signUp.html')


@auth_db.route('/add_new_user', methods=['GET', 'POST'])
def add_new_user():
    new_user = request.json

    response = create_new_user(new_user)

    return response
