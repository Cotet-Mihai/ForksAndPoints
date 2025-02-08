from flask import Blueprint

rooms_bp = Blueprint('rooms', __name__, url_prefix='/rooms')

@rooms_bp.route('/')
def questionnaire():
    return '<h1>Rooms</h1>'
