from flask import Blueprint, render_template, session, request, redirect, url_for
from model.Users import Users

questionnaire_bp = Blueprint('questionnaire', __name__, url_prefix='/questionnaire')

@questionnaire_bp.route('/<step>/')
def questionnaire_step(step):
    if 'userID' not in session:
        return redirect(url_for('auth.sign_in'))

    match step:
        case 'info':
            path = 'questionnaire/partials/info.html'
        case '1':
            path = 'questionnaire/partials/1.html'
        case '2':
            # todo: special page for Non-binary
            path = 'questionnaire/partials/2.html'
        case '3':
            path = 'questionnaire/partials/3.html'
        case '4':
            path = 'questionnaire/partials/4.html'
        case '5':
            path = 'questionnaire/partials/5.html'
        case '6':
            path = 'questionnaire/partials/6.html'
        case 'summary':
            # todo: don't forget this page
            return redirect(url_for('in_progress.in_progress'))
        case _:
            path = 'questionnaire/partials/info.html'


    return render_template('questionnaire/questionnaire.html', path=path)


