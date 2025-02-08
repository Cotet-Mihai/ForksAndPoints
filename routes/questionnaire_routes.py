from flask import Blueprint

questionnaire_bp = Blueprint('questionnaire', __name__, url_prefix='/questionnaire')

@questionnaire_bp.route('/')
def questionnaire():
    return '<h1>Questionnaire</h1>'
