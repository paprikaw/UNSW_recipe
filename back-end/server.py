from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# homepage
@app.route("/")
def homepage():
    # return categories and ingredients
    return "Hello World!"

# adding new user
@app.route("/sign_up")
def signup():
    # return success/fail
    return

# authenticate user and create a session
@app.route("/login")
def login():
    # return success/fail
    return

if __name__ == "__main__":
    app.run(debug = True, port = 8080)
