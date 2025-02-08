from flask import jsonify
from flask_bcrypt import check_password_hash
from app import db, bcrypt
from model.Users import Users

def verify_login(username, password):
    """
    Verifies the user's login credentials by checking the username and password.

    This function first retrieves the user based on the username, then checks if the
    provided password matches the hashed password stored in the database. If successful,
    it returns a success response with the 'firstTime' status. If the login is incorrect,
    it returns an error message.

    :param username: The username of the user trying to log in.
    :param password: The password provided by the user for authentication.
    :return: JSON response indicating the status of the login attempt.
    """
    try:
        # Try to get the user from the database by username
        user = Users.query.filter_by(username=username).first()

        # If the user is not found, raise an error
        if not user:
            raise ValueError('Incorrect username or password')

        # Check if the provided password matches the stored password
        if check_password_hash(user.password, password):
            # If passwords match, return success with the firstTime status
            return jsonify({
                'status': 'success',
                'firstTime': str(user.firstTime)
            }), 200

        # If password is incorrect, raise an error
        raise ValueError('Incorrect username or password')

    except ValueError as e:
        # Handle specific ValueError (incorrect username/password)
        return jsonify({
            'status': 'info',
            'msg': str(e)
        }), 400

    except Exception as e:
        # Catch any other general errors (e.g., database issues) and return an error response
        return jsonify({
            'status': 'error',
            'errorMessage': str(e)
        }), 500

def match_password(first_password, second_password):
    return first_password == second_password

def create_new_user(user):
    is_match_password = match_password(user['password'], user['repetPassword'])
    """
    Creates a new user in the system after validating the username and email.

    This function first checks if the username or email already exists in the database.
    If either is taken, it returns an error response. If not, it creates a new user,
    hashes the password, and saves the new user to the database.

    :param user: A dictionary containing the user information (username, email, password).
    :return: JSON response indicating the result of the user creation process.
    """
    # Hash the password before saving it to the database
    hashed_password = bcrypt.generate_password_hash(user['repetPassword']).decode('utf-8')

    try:
        # Check if the username or email already exists in the database
        existing_users = Users.query.filter(
            (Users.username == user['username']) | (Users.email == user['email'])
        ).all()

        # Determine if the username or email already exists
        username_exists = any(u.username == user['username'] for u in existing_users)
        email_exists = any(u.email == user['email'] for u in existing_users)

        # If username or email exists and passwords not match return an error response
        if username_exists or email_exists or not is_match_password:
            return jsonify({
                'status': 'error',
                'username_exists': username_exists,
                'email_exists': email_exists,
                'passwords_match' : is_match_password,
                'msg': 'Username and/or email already exist!'
            }), 400

        # Create a new user with the provided details
        new_user = Users(
            username=user['username'],
            email=user['email'],
            password=hashed_password,
            firstTime=1  # Set firstTime flag to 1 (true) for a new user
        )

        # Add the new user to the database and commit the transaction
        db.session.add(new_user)
        db.session.commit()

        # Return a success response
        return jsonify({
            'status': 'success',
            'msg': None
        }), 200

    except Exception as e:
        # Catch any general errors (e.g., database issues) and return an error response
        return jsonify({
            'status': 'error',
            'msg': str(e)
        }), 500
