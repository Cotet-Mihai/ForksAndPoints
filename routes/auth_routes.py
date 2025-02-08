from flask import Blueprint, render_template, request, session, redirect, url_for
from services.auth_services import verify_login, create_new_user

# Blueprint for authentication
auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/', methods=['GET', 'POST'])
def sign_in():
    """
    Handle user login.
    GET: Render login page.
    POST: Verify user credentials and return response.
    """
    if 'userID' in session:
        return redirect(url_for('in_progress.in_progress')) # if the user is logged in, redirect to the game page (if not playing, redirect to the cameras page)

    if request.method == 'GET':
        return render_template('auth/index.html')

    elif request.method == 'POST':
        user_to_identify = request.json
        response = verify_login(user_to_identify['username'], user_to_identify['password'])
        return response


@auth_bp.route('/sign-up', methods=['GET', 'POST'])
def sign_up():
    """
    Render sign-up page for new users.
    GET: Render sign-up page.
    POST: Create new user and return response.
    """
    if 'userID' in session:
        return redirect(url_for('in_progress.in_progress')) # if the user is logged in, redirect to the game page (if not playing, redirect to the cameras page)

    if request.method == 'GET':
        return render_template('auth/signUp.html')

    if request.method == 'POST':
        new_user = request.json
        response = create_new_user(new_user)
        return response

@auth_bp.route('/sign-out', methods=['GET'])
def sign_out():
    """
    Log out the user.
    GET: Remove userID from session and redirect to sign-in page.
    """
    session.pop('userID', None)
    return redirect(url_for('auth.sign_in'))