from flask import jsonify
from flask_bcrypt import check_password_hash
from app import db, bcrypt
from model.Users import Users

def verify_login(username, password):
    try:
        user = Users.query.filter_by(username=username).first()

        if check_password_hash(user.password, password):
            return True

    except Exception as e:
        return False


def create_new_user(user):
    hashed_password = bcrypt.generate_password_hash(user['password']).decode('utf-8')

    try:
        existing_users = Users.query.filter(
            (Users.username == user['username']) | (Users.email == user['email'])
        ).all()

        username_exists = any(u.username == user['username'] for u in existing_users)
        email_exists = any(u.email == user['email'] for u in existing_users)

        if username_exists or email_exists:
            return jsonify({
                'status': 'error',
                'username_exists': username_exists,
                'email_exists': email_exists,
                'msg': 'Username and/or email already exist!'
            })

        new_user = Users(
            username=user['username'],
            email=user['email'],
            password=hashed_password,
            firstTime=1
        )

        db.session.add(new_user)
        db.session.commit()

        return jsonify({
            'status': 'success',
            'msg': None
        })

    except Exception as e:
        return jsonify({
            'status': 'error',
            'msg': str(e)
        })
