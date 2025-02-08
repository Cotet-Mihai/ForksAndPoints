from flask import Blueprint, render_template

in_progress_bp = Blueprint('in_progress', __name__, url_prefix='/in-progress')

@in_progress_bp.route('/')
def in_progress():
    return render_template('in_progress.html')