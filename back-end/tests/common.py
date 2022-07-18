import requests
from sqlalchemy import create_engine, text

port = 8080
url = f"http://localhost:{port}/"

# database credential to the MySQL in Google Cloud Storage
# abbreviation: rrs -> Recipe Recommendation System
db_url = 'mysql+pymysql://admin:123123@34.151.68.205:3306/rrs'
db_engine = create_engine(db_url)#, echo=True)

def reset_server():
    requests.delete(url + 'reset')

def getRecipeData1(recipeId, token):
    return {
        "recipeId": recipeId,
        "recipeName": "Beef pie",
        "mealType": "Breakfast",
        "cookTime": 60,
        "token": token,
        "ingredients": [
            {
                "name": "Ground Beef",
                "quantity": 200,
                "unit": "g"
            },
            {
                "name": "White Flour",
                "quantity": 100,
                "unit": "g"
            },
            {
                "name": "Salt",
                "quantity": 3,
                "unit": "g"
            }
        ],
        "steps": ['1. Fry ground beef.', '2. Add salt', '3. Add flour']
    }

def getRecipeData2(recipeId, token):
    return {
        'recipeId': recipeId,
        "recipeName": "No Salt Beef pie",
        "mealType": "Breakfast",
        "cookTime": 60,
        "token": token,
        "ingredients": [
            {
                "name": "Ground Beef",
                "quantity": 200,
                "unit": "g"
            },
            {
                "name": "White Flour",
                "quantity": 100,
                "unit": "g"
            }
        ],
        "steps": ['1. Fry ground beef.', '2. Add flour']
    }
