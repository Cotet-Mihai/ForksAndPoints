from app import db

class Users(db.Model):
    __tablename__ = 'users'

    pid = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False, unique=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(100), nullable=False)
    firstTime = db.Column(db.Boolean, default=True)

