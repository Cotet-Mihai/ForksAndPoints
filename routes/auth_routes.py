from flask import Blueprint, render_template, request
from flask_bcrypt import check_password_hash
from model.Users import Users
from app import db, bcrypt

auth_db = Blueprint('auth', __name__)


@auth_db.route('/', methods=['GET'])
def login_form():
    return render_template('auth/index.html')


@auth_db.route('/', methods=['POST'])
def login():
    username = request.form.get('loginUsername')
    password = request.form.get('loginPassword')

    user = Users.query.filter_by(username=username).first()

    if not user:
        return f"Who are you ?"

    if check_password_hash(user.password, password):
        return f"Hello {username} !"

    else:
        return f"Invalid password "




@auth_db.route('/sign-up', methods=['GET'])
def signup_form():
    return render_template('auth/signup.html')


@auth_db.route('/sign-up', methods=['POST'])
def signup():
    username = request.form.get('signupUsername')
    email = request.form.get('signupEmail')
    password = request.form.get('signupRepetPassword')

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    new_user = Users(
        username=username,
        email=email,
        password=hashed_password,
        firstTime=1
    )

    db.session.add(new_user)
    db.session.commit()

    return str(new_user.username)

