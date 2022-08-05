import accounts
import recipes
import homepage
from flask import Flask, send_from_directory
from sqlalchemy import create_engine

app = Flask(__name__, static_folder='static')

# database credential to the MySQL in Google Cloud Storage
# abbreviation: rrs -> Recipe Recommendation System
db_url = 'mysql+pymysql://admin:ultimate42##@34.151.68.205:3306/rrs'
db_engine = create_engine(db_url)#, echo=True)

@app.route("/static/<path:filepath>")
def send_static(filepath):
    '''
    uploads file from static folder given a filename
    '''
    return send_from_directory(app.static_folder, filepath)

'''
Homepage
'''

@app.route("/category", methods={'GET'})
def category(): 
    '''
    returns the categories and their ingredients ordered by number of uses, and then alphabetically
    in the form: {'CategoryName': ['emoji IngredientName1', 'emoji IngredientName2', ...], ...}
    '''

    return homepage.category(db_engine)

@app.route("/top10", methods={'GET'})
def top10():
    '''
    returns the top 10 most frequently used ingredients (regardless of categories) 
    ordered by number of uses, and then alphabetically in the form:
    {'ingredients': ['🧄 Garlic', ...]}
    '''
    return homepage.top10(db_engine)


@app.route("/reset", methods={'DELETE'})
def reset():
    '''
    resets the database
    returns empty dict
    '''

    return homepage.reset(db_engine)

'''
Accounts
'''

@app.route("/signup", methods={'POST'})
def signup():
    '''
    add a new user on sign up.
    given a new user's username, email and hashed password,
    return success message on success.
    return error message on email duplicate.
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
    logout an existing user's session.
    given an existing user's token, return success message on success.
    return error message on invalid token.
    '''
    return accounts.logout(db_engine)

@app.route("/authenticate", methods={'GET'})
def authenticate():
    '''
    authenticate an existing user's session.
    given an existing user's token, return true on authentic session.
    return false on invalid session.
    {
        'authenticate': Boolean
    } 
    '''
    return accounts.authenticate(db_engine)

'''
Recipes
'''

@app.route("/upload-thumbnail", methods={'POST'})
def upload_thumbnail():
    '''
    given an image file, upload it to the local server and insert filepath into database.
    return recipeId on success. return error message on unsupported file type. 
    '''
    return recipes.recipe_upload_thumbnail(db_engine)

@app.route("/remove-thumbnail", methods={'DELETE'})
def remove_thumbnail():
    '''
    given an image file name, delete it from the local server and remove filepath from database.
    return success message on success. return error message on invalid file name. 
    '''
    return recipes.remove_thumbnail(db_engine, app.static_folder)

@app.route("/update-recipe-info", methods={'POST'})
def update_recipe_info():
    '''
    given a recipeId, recipe name, meal type, cook time, token, ingredients and steps,
    upload or update the recipe on the database.
    return success message on success.
    return error message on invalid token. 
    '''
    return recipes.recipe_update_remaining_info_at_creation(db_engine)

@app.route("/search", methods={'POST'})
def search():
    '''
    given a list of ingredients, 
    return a list of recipes and some of their details that use at least 1 of the ingredients
    '''
    return recipes.search(db_engine)

@app.route("/details", methods={'POST'})
def details():
    '''
    given a recipeId,
    return a recipe's full details
    '''
    return recipes.details(db_engine)

@app.route("/like", methods={'PUT'})
def like():
    '''
    given a recipeId and an existing user's token, update the user's likes.
    if the user has already liked the recipe, remove the like.
    return success message on success.
    return error message on invalid recipeId or invalid token.
    '''
    return recipes.like(db_engine)

@app.route("/topThreeNoResultIngredientSets", methods={'GET'})
def topThreeNoResultIngredientSets():
    '''
    return top 3 searched ingredients sets which has no matching recipes
    return empty list shown as follows if we only have less than three sets
        {
            'ingredients': [['emoji ingre1', 'emoji ingre2', 'emoji ingre3'], ['empty'], ['empty]]
        }
    '''
    return recipes.showTopThreeNoResultIngredientSets(db_engine)

@app.route("/topThreeLikedRecipesOnMealType", methods={'POST'})
def showTopThreeLikedRecipesOnMealType():
    '''
    return top 3 liked recipes based on the given Meal types
    return recipes shown as follows
        {
            'recipes': {
                'recipeId': xxx,
                'recipeName': xxx,
                'cookTime': xxx, 
                'likes': xxx,
                'thumbnail': xxx,
                'mealType': xxx,
            }, 
            {...}, 
            {...}
        }
        if the result is less than 3, then empty result will be shown as empty dict {}
    '''
    return recipes.showTopThreeLikedRecipesOnMealType(db_engine)

if __name__ == "__main__":
    app.run(debug = True, port = 8080)
