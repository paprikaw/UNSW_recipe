from flask import Flask
from config import DevConfig
 
def create_app():
    app = Flask(__name__)
    app.config.from_object(DevConfig)
    app.config['JSON_AS_ASCII'] = False 
 
    return app
