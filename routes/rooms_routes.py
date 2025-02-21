from flask import Blueprint, request, session
from model.Users import PersonalInformations, Users
from app import db

rooms_bp = Blueprint('rooms', __name__, url_prefix='/rooms')

@rooms_bp.route('/')
def rooms():
    return '<h1>TEST</h1>'

@rooms_bp.route('/get-questionnaire-info', methods = ['POST'])
def get_questionnaire_info():
    data = request.get_json()

    try:
        set_personal_information = PersonalInformations(
            userID = session['userID'],
            gender = data['gender'],
            age = data['age'],
            height = data['height'],
            weight = data['weight'],
            diet = data['diet'],
            allergies = data['allergies']
        )

        db.session.add(set_personal_information)
        db.session.commit()

        user = Users.query.filter_by(pid=session['userID']).first()

        if user:
            user.firstTime = 0
            db.session.commit()

        else:
            raise Exception

    except Exception as e:
        print(e)



    return '/rooms'