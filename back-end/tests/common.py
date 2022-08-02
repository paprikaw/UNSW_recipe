import requests
from sqlalchemy import create_engine, text

port = 8080
url = f"http://localhost:{port}/"

def reset_server():
    requests.delete(url + 'reset')

def getRecipeData1(recipeId, token):
    return {
        "recipeId": recipeId,
        "recipeName": "Beef pie",
        "mealType": ["Breakfast"],
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
        "mealType": ["Breakfast", "Tea"],
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

def getRecipeData3(recipeId, token):
    return {
        'recipeId': recipeId,
        'recipeName': 'Salad',
        'mealType': ["Lunch"],
        'cookTime': 20,
        'token': token,
        'ingredients': [
            {
                'name': 'Carrot',
                'quantity': 1,
                'unit': 'g'
            },
            {
                'name': 'Red Onion',
                'quantity': 1,
                'unit': 'g'
            },
            {
                'name': 'Lettuce',
                'quantity': 1,
                'unit': 'g'
            },
            {
                'name': 'Tomato',
                'quantity': 1,
                'unit': 'g'
            },
            {
                'name': 'Lemon',
                'quantity': 1,
                'unit': 'g'
            },
            {
                'name': 'Garlic',
                'quantity': 1,
                'unit': 'g'
            },
            {
                'name': 'Balsamic Vinegar',
                'quantity': 1,
                'unit': 'g'
            }
        ],
        'steps': ['1. Chop all vegetables', '2. Mix all ingredients together']
    }
