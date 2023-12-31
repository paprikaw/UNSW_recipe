import pytest
import requests
import json
import os
from common import url, reset_server, getRecipeData1, getRecipeData2, getRecipeData3

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
    
    assert len(response["results"]) == 3
    assert len(response["results"][0]["ingredientSets"]) == 4
    assert len(response["results"][1]["ingredientSets"]) == 3
    assert len(response["results"][2]["ingredientSets"]) == 4
    assert response["results"][0]["hits"] == 5
    assert response["results"][1]["hits"] == 3
    assert response["results"][2]["hits"] == 2

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

    assert len(response["results"]) == 1
    assert len(response["results"][0]["ingredientSets"]) == 4
    assert response["results"][0]["hits"] == 2

def test_top3_likedRecipeOnMealType_on_success():
    reset_server()

    requests.post(url + 'signup', json={'username': 'user1', 'email': 'user1@gmail.com', 'password': '123'})
    requests.post(url + 'signup', json={'username': 'user2', 'email': 'user2@gmail.com', 'password': '123'})
    requests.post(url + 'signup', json={'username': 'user3', 'email': 'user3@gmail.com', 'password': '123'})

    user1 = json.loads(requests.post(url + 'login', json={'email': 'user1@gmail.com', 'password': '123'}).text)
    user2 = json.loads(requests.post(url + 'login', json={'email': 'user2@gmail.com', 'password': '123'}).text)
    user3 = json.loads(requests.post(url + 'login', json={'email': 'user3@gmail.com', 'password': '123'}).text)

    # user 1 upload recipe 1 and 2
    # user 2 upload recipe 3
    files = {'recipeThumbnail': open(os.path.join(os.path.dirname(__file__), "imgs/thumbnails/index.png"), "rb")}
    thumbnailResponse1 = requests.post(url + 'upload-thumbnail', files=files).json()
    recipeId1 = thumbnailResponse1["recipeId"]
    recipeData1 = getRecipeData1(recipeId1, user1['token'])

    thumbnailResponse2 = requests.post(url + 'upload-thumbnail', files=files).json()
    recipeId2 = thumbnailResponse2["recipeId"]
    recipeData2 = getRecipeData2(recipeId2, user1['token'])

    thumbnailResponse3 = requests.post(url + 'upload-thumbnail', files=files).json()
    recipeId3 = thumbnailResponse3["recipeId"]
    recipeData3 = getRecipeData3(recipeId3, user3['token'])

    requests.post(url + 'update-recipe-info', json=recipeData1)
    requests.post(url + 'update-recipe-info', json=recipeData2)
    requests.post(url + 'update-recipe-info', json=recipeData3)

    # user1 like the first and second recipes
    likeData1 = {
        'recipeId': recipeId1, 
        'token': user1['token']
    }
    likeData2 = {
        'recipeId': recipeId2, 
        'token': user1['token']
    }

    # user 2 like the second recipe
    likeData3 = {
        'recipeId': recipeId2, 
        'token': user2['token']
    }

    # user 3 like the first and third recipe
    likeData4 = {
        'recipeId': recipeId1, 
        'token': user3['token']
    }
    likeData5 = {
        'recipeId': recipeId3, 
        'token': user3['token']
    }
    
    requests.put(url + 'like', json=likeData1)
    requests.put(url + 'like', json=likeData2)
    requests.put(url + 'like', json=likeData3)
    requests.put(url + 'like', json=likeData4)
    requests.put(url + 'like', json=likeData5)

    mealTypes = {
        'mealTypes': ['Breakfast', 'Tea', 'Lunch'],
    }
    response = json.loads(requests.post(url + 'topThreeLikedRecipesOnMealType', json=mealTypes).text)

    assert len(response['recipes']) == 3
    assert response['recipes'][0] != {}
    assert response['recipes'][1] != {}
    assert response['recipes'][2] != {}
    assert response['recipes'][0]['likes'] >= response['recipes'][1]['likes']
    assert response['recipes'][1]['likes'] >= response['recipes'][2]['likes']

def test_top3_likedRecipeOnMealType_on_two_results_only():
    reset_server()

    requests.post(url + 'signup', json={'username': 'user1', 'email': 'user1@gmail.com', 'password': '123'})
    requests.post(url + 'signup', json={'username': 'user2', 'email': 'user2@gmail.com', 'password': '123'})
    requests.post(url + 'signup', json={'username': 'user3', 'email': 'user3@gmail.com', 'password': '123'})

    user1 = json.loads(requests.post(url + 'login', json={'email': 'user1@gmail.com', 'password': '123'}).text)
    user2 = json.loads(requests.post(url + 'login', json={'email': 'user2@gmail.com', 'password': '123'}).text)
    user3 = json.loads(requests.post(url + 'login', json={'email': 'user3@gmail.com', 'password': '123'}).text)

    # user 1 upload recipe 1 and 2
    # user 2 upload recipe 3
    files = {'recipeThumbnail': open(os.path.join(os.path.dirname(__file__), "imgs/thumbnails/index.png"), "rb")}
    thumbnailResponse1 = requests.post(url + 'upload-thumbnail', files=files).json()
    recipeId1 = thumbnailResponse1["recipeId"]
    recipeData1 = getRecipeData1(recipeId1, user1['token'])

    thumbnailResponse2 = requests.post(url + 'upload-thumbnail', files=files).json()
    recipeId2 = thumbnailResponse2["recipeId"]
    recipeData2 = getRecipeData2(recipeId2, user1['token'])

    requests.post(url + 'update-recipe-info', json=recipeData1)
    requests.post(url + 'update-recipe-info', json=recipeData2)

    # user 1 like the first and second recipes
    likeData1 = {
        'recipeId': recipeId1, 
        'token': user1['token']
    }
    likeData2 = {
        'recipeId': recipeId2, 
        'token': user1['token']
    }

    # user 2 like the second recipe
    likeData3 = {
        'recipeId': recipeId2, 
        'token': user2['token']
    }

    # user 3 like and removes like on first recipe
    likeData4 = {
        'recipeId': recipeId1, 
        'token': user3['token']
    }
    likeData5 = {
        'recipeId': recipeId1, 
        'token': user3['token']
    }

    requests.put(url + 'like', json=likeData1)
    requests.put(url + 'like', json=likeData2)
    requests.put(url + 'like', json=likeData3)
    requests.put(url + 'like', json=likeData4)
    requests.put(url + 'like', json=likeData5)

    mealTypes = {
        'mealTypes': ['Breakfast', 'Tea', 'Lunch'],
    }
    response = json.loads(requests.post(url + 'topThreeLikedRecipesOnMealType', json=mealTypes).text)

    assert len(response['recipes']) == 2
    assert response['recipes'][0] != {}
    assert response['recipes'][1] != {}
    assert response['recipes'][0]['likes'] >= response['recipes'][1]['likes']
