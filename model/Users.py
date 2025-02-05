from app import db

class Users(db.Model):
    __tablename__ = 'users'

    pid = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return f'User with name {self.name} and password {self.password}'