import os
import sqlparse
from venv import create
from flask import Flask, request
from flask_cors import CORS
from sqlalchemy import create_engine, text

app = Flask(__name__)
CORS(app)

# database credential to the MySQL in Google Cloud Storage
# abbreviation: rrs -> Recipe Recommendation System
db_url = 'mysql+pymysql://admin:123123@34.151.68.205:3306/rrs'
db_engine = create_engine(db_url)#, echo=True)

__location__ = os.path.realpath(
    os.path.join(os.getcwd(), os.path.dirname(__file__)))

# homepage
@app.route("/")
def homepage():
    # return categories and ingredients
    return "Hello World!"

@app.route("/sign_up", methods={'POST'})
def signup():
    '''
    add a new user on sign up
    return empty dictionary on success
    return error message on email duplicate
    '''
    payload = request.get_json()
    username = payload['username']
    email = payload['email']
    passwordHash = payload['password']

    with db_engine.connect() as con:
        result = con.execute(text('select * from Accounts where email = :email'), email=email).fetchall()
        if len(result) > 0:
            return {'error': 'Email already in use.'}
        con.execute(
            text('insert into Accounts(username, email, password) values (:username, :email, :password)'), 
            username=username, email=email, password=passwordHash
        )

    return {}

# authenticate user and create a session
@app.route("/login")
def login():
    # return success/fail
    return {}

@app.route("/reset", methods={'DELETE'})
def reset():
    '''
    resets the database
    returns empty dict
    '''
    with db_engine.connect() as con:
        with open(os.path.join(__location__, 'schema.sql')) as schema:
            queries = sqlparse.split(sqlparse.format(schema.read(), strip_comments=True, reindent=True))
            for query in queries:
                con.execute(text(query))
    return {}

if __name__ == "__main__":
    app.run(debug = True, port = 8080)
