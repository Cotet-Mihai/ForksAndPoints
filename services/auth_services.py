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
        existing_user = Users.query.filter(
            (Users.username == user['username']) | (Users.email == user['email'])
        ).first()

        if existing_user:
            if existing_user.username == user['username']:
                return jsonify({
                    'status': 'error',
                    'msg': 'Username already exist!'
                })
            if existing_user.email == user['email']:
                return jsonify({
                    'status': 'error',
                    'msg': 'Email already exist!'
                })

        new_user = Users(
            username = user['username'],
            email = user['email'],
            password = hashed_password,
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
