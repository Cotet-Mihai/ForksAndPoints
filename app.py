import os
from dotenv import load_dotenv
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate


db = SQLAlchemy()

def create_app():
    load_dotenv()

    app = Flask(__name__)
    app.secret_key = os.getenv('SECRET_KEY')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('MYSQL_URI')

    db.init_app(app)

    from routes.auth_routes import auth_db
    app.register_blueprint(auth_db)

    migrate = Migrate(app, db)

    # Blueprints

    return app