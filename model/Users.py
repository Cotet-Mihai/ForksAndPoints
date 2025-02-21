from app import db

class Users(db.Model):
    __tablename__ = 'users'

    pid = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False, unique=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(100), nullable=False)
    firstTime = db.Column(db.Boolean, default=True)

class PersonalInformations(db.Model):
    __tablename__ = 'personalInformation'

    pid = db.Column(db.Integer, primary_key=True)
    userID = db.Column(db.Integer, db.ForeignKey('users.pid', ondelete='CASCADE'), nullable=False)
    gender = db.Column(db.String(20), nullable=False)
    birthday = db.Column(db.Date, nullable=False)
    height = db.Column(db.Integer, nullable=False)
    weight = db.Column(db.Integer, nullable=False)
    diet = db.Column(db.String(20), nullable=True)
    allergies = db.Column(db.JSON, nullable=True)
