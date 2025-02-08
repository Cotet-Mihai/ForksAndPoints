import os
from dotenv import load_dotenv
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
bcrypt = Bcrypt()

def create_app():
    load_dotenv()

    # Config app

    app = Flask(__name__)
    app.secret_key = os.getenv('SECRET_KEY')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('MYSQL_URI')

    # Init

    db.init_app(app)
    bcrypt.init_app(app)

    # Blueprints

    from routes.auth_routes import auth_db
    from routes.rooms_routes import rooms_bp
    from routes.questionnaire_routes import questionnaire_bp

    app.register_blueprint(auth_db)
    app.register_blueprint(rooms_bp)
    app.register_blueprint(questionnaire_bp)

    # Migrate

    migrate = Migrate(app, db)

    return app