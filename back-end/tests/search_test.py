from urllib import response
import pytest
import requests
import json
import os
from common import url, reset_server, getRecipeData1, getRecipeData2

def test_search_multiple_responses():
    reset_server()

    requests.post(url + 'signup', json={'username': 'user1', 'email': 'user1@gmail.com', 'password': '123'})
    user1 = json.loads(requests.post(url + 'login', json={'email': 'user1@gmail.com', 'password': '123'}).text)
    
    files = {'recipeThumbnail': open(os.path.join(os.path.dirname(__file__), "imgs/thumbnails/index.png"), "rb")}
    
    thumbnailResponse1 = requests.post(url + 'upload-thumbnail', files=files).json()
    recipeData1 = getRecipeData1(thumbnailResponse1["recipeId"], user1["token"])

    thumbnailResponse2 = requests.post(url + 'upload-thumbnail', files=files).json()
    recipeData2 = getRecipeData2(thumbnailResponse2["recipeId"], user1["token"])

    requests.post(url + 'update-recipe-info', json=recipeData1)
    requests.post(url + 'update-recipe-info', json=recipeData2)

    payload = {
        'ingredients': ['Ground Beef', 'White Flour', 'Salt'],
        'token': user1["token"]
    }
    response = json.loads(requests.post(url + 'search', json=payload).text)

    # should be arranged according to num ingredients matched
    assert response['recipes'][0]['recipeName'] == 'Beef pie'
    assert response['recipes'][1]['recipeName'] == 'No Salt Beef pie' 
    assert response['recipes'][0]['mealType'] == ['Breakfast']
    assert response['recipes'][1]['mealType'] == ['Breakfast', 'Tea']
    assert response['recipes'][0]['liked'] == False
    assert response['recipes'][1]['liked'] == False
    assert response['recipes'][0]['numIngredientsMatched'] == 3
    assert response['recipes'][1]['numIngredientsMatched'] == 2

def test_search_no_matches():
    reset_server()

    requests.post(url + 'signup', json={'username': 'user1', 'email': 'user1@gmail.com', 'password': '123'})
    user1 = json.loads(requests.post(url + 'login', json={'email': 'user1@gmail.com', 'password': '123'}).text)
    
    files = {'recipeThumbnail': open(os.path.join(os.path.dirname(__file__), "imgs/thumbnails/index.png"), "rb")}
    
    thumbnailResponse1 = requests.post(url + 'upload-thumbnail', files=files).json()
    recipeData1 = getRecipeData1(thumbnailResponse1["recipeId"], user1["token"])

    thumbnailResponse2 = requests.post(url + 'upload-thumbnail', files=files).json()
    recipeData2 = getRecipeData2(thumbnailResponse2["recipeId"], user1["token"])

    requests.post(url + 'update-recipe-info', json=recipeData1)
    requests.post(url + 'update-recipe-info', json=recipeData2)

    payload = {
        'ingredients': ['Garlic', 'Onion', 'Potato'],
        'token': user1["token"]
    }
    response = json.loads(requests.post(url + 'search', json=payload).text)

    assert len(response['recipes']) == 0

def test_top3_noResultIngredientSets_ideal_case():
    reset_server()
    requests.post(url + 'signup', json={'username': 'user1', 'email': 'user1@gmail.com', 'password': '123'})
    user1 = json.loads(requests.post(url + 'login', json={'email': 'user1@gmail.com', 'password': '123'}).text)

    # searched once
    payload = {
            'ingredients': ['Ground Beef', 'White Flour', 'Salt', 'Celery'],
            'token': user1["token"]
        }
    json.loads(requests.post(url + 'search', json=payload).text)

    # searched 5 times
    payload = {
            'ingredients': ['Banana', 'Lemon', 'Pineapple', 'Apple'],
            'token': user1["token"]
        }
    json.loads(requests.post(url + 'search', json=payload).text)
    json.loads(requests.post(url + 'search', json=payload).text)
    json.loads(requests.post(url + 'search', json=payload).text)
    json.loads(requests.post(url + 'search', json=payload).text)
    json.loads(requests.post(url + 'search', json=payload).text)   

    # searched twice
    payload = {
            'ingredients': ['Oats', 'Almond', 'Peanut', 'Apple'],
            'token': user1["token"]
        }
    json.loads(requests.post(url + 'search', json=payload).text)
    json.loads(requests.post(url + 'search', json=payload).text) 

    # searched 3 times
    payload = {
            'ingredients': ['Oats', 'Peanut', 'Apple'],
            'token': user1["token"]
        }
    json.loads(requests.post(url + 'search', json=payload).text)
    json.loads(requests.post(url + 'search', json=payload).text)
    json.loads(requests.post(url + 'search', json=payload).text)
    response = requests.get(url + 'topThreeNoResultIngredientSets').json()
    
    assert len(response["ingredientSets"]) == 3
    assert len(response["ingredientSets"][0]) == 4
    assert len(response["ingredientSets"][1]) == 3
    assert len(response["ingredientSets"][2]) == 4
    assert response["hits"][0] == 5
    assert response["hits"][1] == 3
    assert response["hits"][2] == 2
    assert '🍎 Apple' in response["ingredientSets"][0]
    assert '🍎 Apple' in response["ingredientSets"][1]
    assert '🍎 Apple' in response["ingredientSets"][2]

    assert '🍍 Pineapple' not in response["ingredientSets"][1]
    assert '🍍 Pineapple' not in response["ingredientSets"][2]

def test_top3_noResultIngredientSets_missing_sets():
    reset_server()
    requests.post(url + 'signup', json={'username': 'user1', 'email': 'user1@gmail.com', 'password': '123'})
    user1 = json.loads(requests.post(url + 'login', json={'email': 'user1@gmail.com', 'password': '123'}).text)

    # searched twice
    payload = {
            'ingredients': ['Ground Beef', 'White Flour', 'Salt', 'Celery'],
            'token': user1["token"]
        }
    json.loads(requests.post(url + 'search', json=payload).text)
    json.loads(requests.post(url + 'search', json=payload).text)
    response = requests.get(url + 'topThreeNoResultIngredientSets').json()

    assert len(response["ingredientSets"]) == 3
    assert len(response["ingredientSets"][0]) == 4
    assert len(response["ingredientSets"][1]) == 1
    assert len(response["ingredientSets"][2]) == 1
    assert response["hits"][0] == 2
    assert response["hits"][1] == 0
    assert response["hits"][2] == 0
