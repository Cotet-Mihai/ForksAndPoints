from flask import Blueprint, render_template, request
from services.auth_services import verify_login, create_new_user

# Blueprint for authentication
auth_db = Blueprint('auth', __name__)

@auth_db.route('/', methods=['GET', 'POST'])
def sign_in():
    """
    Handle user login.
    GET: Render login page.
    POST: Verify user credentials and return response.
    """
    if request.method == 'GET':
        return render_template('auth/index.html')

    elif request.method == 'POST':
        user_to_identify = request.json
        response = verify_login(user_to_identify['username'], user_to_identify['password'])
        return response


@auth_db.route('/sign-up', methods=['GET'])
def sign_up():
    """
    Render sign-up page for new users.
    """
    return render_template('auth/signUp.html')


@auth_db.route('/add_new_user', methods=['GET', 'POST'])
def add_new_user():
    """
    Handle user creation.
    POST: Create new user in the database.
    """
    new_user = request.json
    response = create_new_user(new_user)
    return response
