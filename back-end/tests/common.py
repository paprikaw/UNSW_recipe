import os
import requests

port = 8080
url = f"http://localhost:{port}/"

def reset_server():
    requests.delete(url + 'reset')
    
def getRecipeData1(recipeId, accountId):
    return {
        "recipeId": recipeId,
        "recipeName": "Beef pie",
        "mealType": "breakfast",
        "cookTime": 60,
        "accountId": accountId,
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
        ]
    }

def getRecipeData2(recipeId, accountId):
    return {
        'recipeId': recipeId,
        "recipeName": "No Salt Beef pie",
        "mealType": "breakfast",
        "cookTime": 60,
        "accountId": accountId,
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
        ]
    }