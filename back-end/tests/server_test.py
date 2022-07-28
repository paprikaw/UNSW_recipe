import pytest
import requests
import json
import os
from common import getRecipeData3, url, reset_server, getRecipeData1, getRecipeData2

def test_category():
    reset_server()

    response = requests.get(url + 'category').json()

    assert 'Vegetables' in response
    assert 'Fruits' in response
    assert 'Meat and Fish' in response
    assert 'Eggs and Dairy' in response
    assert 'Grains and Nuts' in response
    assert 'Pasta and Noodles' in response
    assert 'Baking Products' in response
    assert 'Herbs, Seasonings and Spices' in response
    assert 'Fats and Oils' in response
    assert 'Condiments and Dressings' in response

def test_category_ingredients_sorted_by_num_uses():
    reset_server()

    requests.post(url + 'signup', json={'username': 'user1', 'email': 'user1@gmail.com', 'password': '123'})
    user1 = json.loads(requests.post(url + 'login', json={'email': 'user1@gmail.com', 'password': '123'}).text)
    
    files = {'recipeThumbnail': open(os.path.join(os.path.dirname(__file__), "imgs/thumbnails/index.png"), "rb")}
    
    thumbnailResponse1 = requests.post(url + 'upload-thumbnail', files=files).json()
    recipeData1 = getRecipeData1(thumbnailResponse1["recipeId"], user1["token"])

    requests.post(url + 'update-recipe-info', json=recipeData1)

    response = requests.get(url + 'category').json()
    assert response['Meat and Fish'][0] == "🐮 Ground Beef"
    assert response['Baking Products'][0] == "🌾 White Flour"
    assert response['Herbs, Seasonings and Spices'][0] == "🧂 Salt" 

def test_top10():
    reset_server()

    requests.post(url + 'signup', json={'username': 'user1', 'email': 'user1@gmail.com', 'password': '123'})
    user1 = json.loads(requests.post(url + 'login', json={'email': 'user1@gmail.com', 'password': '123'}).text)
    
    files = {'recipeThumbnail': open(os.path.join(os.path.dirname(__file__), "imgs/thumbnails/index.png"), "rb")}
    
    thumbnailResponse1 = requests.post(url + 'upload-thumbnail', files=files).json()
    recipeData1 = getRecipeData1(thumbnailResponse1["recipeId"], user1["token"])

    thumbnailResponse2 = requests.post(url + 'upload-thumbnail', files=files).json()
    recipeData2 = getRecipeData2(thumbnailResponse2["recipeId"], user1["token"])

    thumbnailResponse3 = requests.post(url + 'upload-thumbnail', files=files).json()
    recipeData3 = getRecipeData3(thumbnailResponse3["recipeId"], user1["token"])

    requests.post(url + 'update-recipe-info', json=recipeData1)
    requests.post(url + 'update-recipe-info', json=recipeData2)
    requests.post(url + 'update-recipe-info', json=recipeData3)

    response = requests.get(url + 'top10').json()

    assert response['ingredients'] == [
        '🐮 Ground Beef', '🌾 White Flour', '🥫 Balsamic Vinegar', '🥕 Carrot', '🧄 Garlic',
        '🍋 Lemon', '🥬 Lettuce', '🧅 Red Onion', '🧂 Salt', '🍅 Tomato'
    ]