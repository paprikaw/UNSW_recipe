from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# homepage
@app.route("/")
def hello():
    return "Hello World!"

# adding new user
@app.route("/sign_up")
def signup():
    return

# authenticate user and create a session
@app.route("/login")
def login():
    return

if __name__ == "__main__":
    app.run(debug = True, port = 8080)
