import pytest
import requests
import json
import os
from common import url, reset_server

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

def test_upload_image_success():
    reset_server()

    files = {'recipeThumbnail': open(os.path.join(os.path.dirname(__file__), "imgs/thumbnails/index.png"), "rb")}
    response = requests.post(url + 'upload-thumbnail', files=files)
    rjson = response.json()
    
    assert response.status_code == 200
    assert rjson['status'] == True
    assert rjson['msg'] == 'Image upload success'

def test_upload_image_failure_on_file_type_not_supported():
    reset_server()

    files = {'recipeThumbnail': open(os.path.join(os.path.dirname(__file__), "text/test.txt"), "rb")}
    response = requests.post(url + 'upload-thumbnail', files=files)
    rjson = response.json()

    assert response.status_code == 200
    assert rjson['status'] == False
    assert rjson['msg'] == 'Unsupported file type'

def test_upload_image_success_on_duplicate_file_name():
    reset_server()
    files = {'recipeThumbnail': open(os.path.join(os.path.dirname(__file__), "imgs/thumbnails/index.png"), "rb")}
    response1 = requests.post(url + 'upload-thumbnail', files=files)
    rjson1 = response1.json()

    files = {'recipeThumbnail': open(os.path.join(os.path.dirname(__file__), "imgs/thumbnails/index.png"), "rb")}
    response2 = requests.post(url + 'upload-thumbnail', files=files)
    rjson2 = response2.json()

    assert response1.status_code == 200
    assert response2.status_code == 200
    assert rjson1['status'] == True
    assert rjson1['msg'] == 'Image upload success'
    assert rjson2['status'] == True
    assert rjson2['msg'] == 'Image upload success'
    assert rjson2['value'] > rjson1['value']

def test_update_success():
    reset_server()
    user1 = json.loads(requests.post(url + 'signup', json={'username': 'user1', 'email': 'user1@gmail.com', 'password': '123'}).text)
    user1 = json.loads(requests.post(url + 'login', json={'email': 'user1@gmail.com', 'password': '123'}).text)
    
    files = {'recipeThumbnail': open(os.path.join(os.path.dirname(__file__), "imgs/thumbnails/index.png"), "rb")}
    response2 = requests.post(url + 'upload-thumbnail', files=files)
    rjson2 = response2.json()

    jsonData = getRecipeData1(rjson2["value"], user1["data"]["accountId"])

    result = json.loads(requests.post(url + 'update-recipe-info', json=jsonData).text)
    assert result['status'] == True

def test_update_failure_on_invalid_recipeName():
    reset_server()
    user1 = json.loads(requests.post(url + 'signup', json={'username': 'user1', 'email': 'user1@gmail.com', 'password': '123'}).text)
    user1 = json.loads(requests.post(url + 'login', json={'email': 'user1@gmail.com', 'password': '123'}).text)
    
    files = {'recipeThumbnail': open(os.path.join(os.path.dirname(__file__), "imgs/thumbnails/index.png"), "rb")}
    response2 = requests.post(url + 'upload-thumbnail', files=files)
    rjson2 = response2.json()

    jsonData = {
        "recipeId": rjson2["value"],
        "recipeName": 12345,
        "mealType": "breakfast",
        "cookTime": 60,
        "accountId": user1["data"]["accountId"],
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

    result = json.loads(requests.post(url + 'update-recipe-info', json=jsonData).text)
    assert result['status'] == False

def test_search_multiple_responses():
    reset_server()

    requests.post(url + 'signup', json={'username': 'user1', 'email': 'user1@gmail.com', 'password': '123'})
    user1 = json.loads(requests.post(url + 'login', json={'email': 'user1@gmail.com', 'password': '123'}).text)
    
    files = {'recipeThumbnail': open(os.path.join(os.path.dirname(__file__), "imgs/thumbnails/index.png"), "rb")}
    thumbnailResponse1 = requests.post(url + 'upload-thumbnail', files=files).json()

    recipeData1 = getRecipeData1(thumbnailResponse1["value"], user1["data"]["accountId"])

    thumbnailResponse2 = requests.post(url + 'upload-thumbnail', files=files).json()
    recipeData2 = getRecipeData2(thumbnailResponse2["value"], user1["data"]["accountId"])

    requests.post(url + 'update-recipe-info', json=recipeData1)
    requests.post(url + 'update-recipe-info', json=recipeData2)

    runningList = {'ingredients': ['Ground Beef', 'White Flour', 'Salt']}
    response = json.loads(requests.post(url + 'search', json=runningList).text)

    # should be arranged according to num ingredients matched
    assert response['recipes'][0]['recipeName'] == 'Beef pie'
    assert response['recipes'][1]['recipeName'] == 'No Salt Beef pie' 
    assert response['recipes'][0]['numIngredientsMatched'] == 3
    assert response['recipes'][1]['numIngredientsMatched'] == 2

def test_search_no_matches():
    reset_server()

    requests.post(url + 'signup', json={'username': 'user1', 'email': 'user1@gmail.com', 'password': '123'})
    user1 = json.loads(requests.post(url + 'login', json={'email': 'user1@gmail.com', 'password': '123'}).text)
    
    files = {'recipeThumbnail': open(os.path.join(os.path.dirname(__file__), "imgs/thumbnails/index.png"), "rb")}
    thumbnailResponse1 = requests.post(url + 'upload-thumbnail', files=files).json()
    recipeData1 = getRecipeData1(thumbnailResponse1["value"], user1["data"]["accountId"])

    thumbnailResponse2 = requests.post(url + 'upload-thumbnail', files=files).json()
    recipeData2 = getRecipeData2(thumbnailResponse2["value"], user1["data"]["accountId"])

    requests.post(url + 'update-recipe-info', json=recipeData1)
    requests.post(url + 'update-recipe-info', json=recipeData2)

    runningList = {'ingredients': ['Garlic', 'Onion', 'Potato']}
    response = json.loads(requests.post(url + 'search', json=runningList).text)

    assert len(response['recipes']) == 0