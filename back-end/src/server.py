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

# Commented here as Template
# @app.route('/', methods=['GET', 'POST'])
# def home():
#     if request.method == 'POST':
#         name = request.form['name']
#         phone = request.form['phoneNumber']
#         print(name, " ", phone)
#         db_engine = create_engine(db_url)
#         with db_engine.connect() as con:
#             con.execute(text('INSERT INTO Contacts VALUES (:name, :phone_number);'),[{'name':name, 'phone_number':phone}])
#     return render_template('contactform.html') # deleted this html as it is for tech validation only

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
            # should i return error code 400 ???
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

# reset server and db
@app.route("/reset", methods={'DELETE'})
def reset():
    with db_engine.connect() as con:
        with open(os.path.join(__location__, 'schema.sql')) as schema:
            queries = sqlparse.split(sqlparse.format(schema.read(), strip_comments=True, reindent=True))
            for query in queries:
                con.execute(text(query))

if __name__ == "__main__":
    app.run(debug = True, port = 8080)
