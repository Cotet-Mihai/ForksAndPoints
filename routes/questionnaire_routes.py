from flask import Blueprint, render_template, session

from model.Users import Users

questionnaire_bp = Blueprint('questionnaire', __name__, url_prefix='/questionnaire')

@questionnaire_bp.route('/')
def questionnaire():
    return render_template('questionnaire/questionnaire.html', myUsername=Users.query.filter_by(pid=session['userID']).first().username)
