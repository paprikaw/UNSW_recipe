import os
import sqlparse
import accounts
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

@app.route("/", methods={'GET'})
def homepage(): 
    '''
    homepage returns the categories and their ingredients in the form:
    {'CategoryName': ['IngredientName1', 'IngredientName2', ...], ...}
    '''
    response = {}
    with db_engine.connect() as con:
        result = con.execute(text('''
            select Categories.categoryName, group_concat(Ingredients.ingredientName separator ',') 
            from Categories left outer join Ingredients on Categories.categoryId = Ingredients.categoryId 
            group by Categories.categoryName
        ''')).fetchall()
        for row in result:
            response[row[0]] = [ingredient for ingredient in row[1].split(',')]

    return response

@app.route("/signup", methods={'POST'})
def signup():
    '''
    add a new user on sign up
    given a new user's username, email and hashed password,
    return success message on success
    return error message on email duplicate
    '''
    return accounts.signup(db_engine)

@app.route("/login", methods={'POST'})
def login():
    '''
    login an existing user
    '''
    return accounts.login(db_engine)

@app.route("/logout", methods={'DELETE'})
def logout():
    '''
    logout an existing user's session
    given an existing user's token, return success message on success
    return error message on invalid token
    '''
    return accounts.logout(db_engine)

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
