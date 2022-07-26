import pytest
import requests
import json
import os
from common import url, reset_server, getRecipeData1, getRecipeData2

@pytest.fixture
def setup_two_recipes():
    reset_server()

    requests.post(url + 'signup', json={'username': 'user1', 'email': 'user1@gmail.com', 'password': '123'})
    user1 = json.loads(requests.post(url + 'login', json={'email': 'user1@gmail.com', 'password': '123'}).text)
    
    files = {'recipeThumbnail': open(os.path.join(os.path.dirname(__file__), "imgs/thumbnails/index.png"), "rb")}
    
    thumbnailResponse1 = requests.post(url + 'upload-thumbnail', files=files).json()
    recipeData1 = getRecipeData1(thumbnailResponse1["value"], user1["token"])

    thumbnailResponse2 = requests.post(url + 'upload-thumbnail', files=files).json()
    recipeData2 = getRecipeData2(thumbnailResponse2["value"], user1["token"])

    requests.post(url + 'update-recipe-info', json=recipeData1)
    requests.post(url + 'update-recipe-info', json=recipeData2)

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

    jsonData = getRecipeData1(rjson2["value"], user1["token"])

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
        "mealType": "Breakfast",
        "cookTime": 60,
        "token": user1["token"],
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

    result = json.loads(requests.post(url + 'update-recipe-info', json=jsonData).text)
    assert result['status'] == False

def test_update_failure_on_invalid_token():
    reset_server()

    requests.post(url + 'signup', json={'username': 'user1', 'email': 'user1@gmail.com', 'password': '123'})
    user1 = json.loads(requests.post(url + 'login', json={'email': 'user1@gmail.com', 'password': '123'}).text)
    
    files = {'recipeThumbnail': open(os.path.join(os.path.dirname(__file__), "imgs/thumbnails/index.png"), "rb")}
    
    thumbnailResponse1 = requests.post(url + 'upload-thumbnail', files=files).json()
    recipeData1 = getRecipeData1(thumbnailResponse1["value"], 'invalid token')

    response = json.loads(requests.post(url + 'update-recipe-info', json=recipeData1).text)
    assert response['status'] == False
    assert response['error'] == 'Invalid token'

def test_search_multiple_responses():
    reset_server()

    requests.post(url + 'signup', json={'username': 'user1', 'email': 'user1@gmail.com', 'password': '123'})
    user1 = json.loads(requests.post(url + 'login', json={'email': 'user1@gmail.com', 'password': '123'}).text)
    
    files = {'recipeThumbnail': open(os.path.join(os.path.dirname(__file__), "imgs/thumbnails/index.png"), "rb")}
    
    thumbnailResponse1 = requests.post(url + 'upload-thumbnail', files=files).json()
    recipeData1 = getRecipeData1(thumbnailResponse1["value"], user1["token"])

    thumbnailResponse2 = requests.post(url + 'upload-thumbnail', files=files).json()
    recipeData2 = getRecipeData2(thumbnailResponse2["value"], user1["token"])

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
    recipeData1 = getRecipeData1(thumbnailResponse1["value"], user1["token"])

    thumbnailResponse2 = requests.post(url + 'upload-thumbnail', files=files).json()
    recipeData2 = getRecipeData2(thumbnailResponse2["value"], user1["token"])

    requests.post(url + 'update-recipe-info', json=recipeData1)
    requests.post(url + 'update-recipe-info', json=recipeData2)

    payload = {
        'ingredients': ['Garlic', 'Onion', 'Potato'],
        'token': user1["token"]
    }
    response = json.loads(requests.post(url + 'search', json=payload).text)

    assert len(response['recipes']) == 0

def test_details_valid_recipe_id():
    reset_server()

    requests.post(url + 'signup', json={'username': 'user1', 'email': 'user1@gmail.com', 'password': '123'})
    user1 = json.loads(requests.post(url + 'login', json={'email': 'user1@gmail.com', 'password': '123'}).text)
    token = user1['token']

    files = {'recipeThumbnail': open(os.path.join(os.path.dirname(__file__), "imgs/thumbnails/index.png"), "rb")}
    
    thumbnailResponse1 = requests.post(url + 'upload-thumbnail', files=files).json()
    recipeId1 = thumbnailResponse1["value"]
    recipeData1 = getRecipeData1(recipeId1, token)

    thumbnailResponse2 = requests.post(url + 'upload-thumbnail', files=files).json()
    recipeId2 = thumbnailResponse2["value"]
    recipeData2 = getRecipeData2(recipeId2, token)

    requests.post(url + 'update-recipe-info', json=recipeData1)
    requests.post(url + 'update-recipe-info', json=recipeData2)

    response1 = json.loads(requests.get(url + 'details', json={'recipeId': recipeId1, 'token': token}).text)
    response2 = json.loads(requests.get(url + 'details', json={'recipeId': recipeId2, 'token': token}).text)

    assert response1['recipe']['recipeId'] == 1
    assert response1['recipe']['username'] == 'user1'
    assert response1['recipe']['recipeName'] == 'Beef pie'
    assert response1['recipe']['mealType'] == 'Breakfast'
    assert response1['recipe']['cookTime'] == 60
    assert response1['recipe']['ingredients'] == [
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
    assert response1['recipe']['steps'][0] == '1. Fry ground beef.'
    assert response1['recipe']['steps'][1] == '2. Add salt'
    assert response1['recipe']['steps'][2] == '3. Add flour'
    assert response1['recipe']['liked'] == False

    assert response2['recipe']['recipeId'] == 2
    assert response2['recipe']['username'] == 'user1'
    assert response2['recipe']['recipeName'] == 'No Salt Beef pie'
    assert response2['recipe']['mealType'] == 'Breakfast'
    assert response2['recipe']['cookTime'] == 60
    assert response2['recipe']['ingredients'] == [
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
    assert response2['recipe']['steps'][0] == '1. Fry ground beef.'
    assert response2['recipe']['steps'][1] == '2. Add flour'
    assert response2['recipe']['liked'] == False

def test_details_invalid_recipe_id():
    
    reset_server()

    requests.post(url + 'signup', json={'username': 'user1', 'email': 'user1@gmail.com', 'password': '123'})
    user1 = json.loads(requests.post(url + 'login', json={'email': 'user1@gmail.com', 'password': '123'}).text)
    token = user1['token']

    files = {'recipeThumbnail': open(os.path.join(os.path.dirname(__file__), "imgs/thumbnails/index.png"), "rb")}
    
    thumbnailResponse1 = requests.post(url + 'upload-thumbnail', files=files).json()
    recipeId1 = thumbnailResponse1["value"]
    recipeData1 = getRecipeData1(recipeId1, token)

    thumbnailResponse2 = requests.post(url + 'upload-thumbnail', files=files).json()
    recipeId2 = thumbnailResponse2["value"]
    recipeData2 = getRecipeData2(recipeId2, token)

    requests.post(url + 'update-recipe-info', json=recipeData1)
    requests.post(url + 'update-recipe-info', json=recipeData2)

    response1 = json.loads(requests.get(url + 'details', json={'recipeId': 3, 'token': token}).text)
    response2 = json.loads(requests.get(url + 'details', json={'recipeId': -1, 'token': token}).text)
    
    assert response1 == {'recipe': {}}
    assert response2 == {'recipe': {}}

def test_like_success():
    reset_server()

    requests.post(url + 'signup', json={'username': 'user1', 'email': 'user1@gmail.com', 'password': '123'})
    user1 = json.loads(requests.post(url + 'login', json={'email': 'user1@gmail.com', 'password': '123'}).text)
    token = user1['token']

    files = {'recipeThumbnail': open(os.path.join(os.path.dirname(__file__), "imgs/thumbnails/index.png"), "rb")}
    
    thumbnailResponse1 = requests.post(url + 'upload-thumbnail', files=files).json()
    recipeId1 = thumbnailResponse1["value"]
    recipeData1 = getRecipeData1(recipeId1, token)

    thumbnailResponse2 = requests.post(url + 'upload-thumbnail', files=files).json()
    recipeId2 = thumbnailResponse2["value"]
    recipeData2 = getRecipeData2(recipeId2, token)

    requests.post(url + 'update-recipe-info', json=recipeData1)
    requests.post(url + 'update-recipe-info', json=recipeData2)

    likeData1 = {
        'recipeId': recipeId1, 
        'token': token
    }
    likeData2 = {
        'recipeId': recipeId2, 
        'token': token
    }

    response1 = json.loads(requests.put(url + 'like', json=likeData1).text)
    response2 = json.loads(requests.put(url + 'like', json=likeData2).text)

    assert response1['msg'] == 'LIKE_SUCCESS'
    assert response1['error'] == ''
    assert response2['msg'] == 'LIKE_SUCCESS'
    assert response2['error'] == ''
    
    payload = {
        'ingredients': ['Ground Beef', 'White Flour', 'Salt'],
        'token': user1["token"]
    }
    
    response = json.loads(requests.post(url + 'search', json=payload).text)
    
    assert response['recipes'][0]['liked'] == True
    assert response['recipes'][1]['liked'] == True

    response1 = json.loads(requests.get(url + 'details', json={'recipeId': recipeId1, 'token': token}).text)
    response2 = json.loads(requests.get(url + 'details', json={'recipeId': recipeId2, 'token': token}).text)
    assert response1['recipe']['liked'] == True
    assert response1['recipe']['liked'] == True

def test_like_failure_on_invalid_token():
    reset_server()

    requests.post(url + 'signup', json={'username': 'user1', 'email': 'user1@gmail.com', 'password': '123'})
    user1 = json.loads(requests.post(url + 'login', json={'email': 'user1@gmail.com', 'password': '123'}).text)
    
    files = {'recipeThumbnail': open(os.path.join(os.path.dirname(__file__), "imgs/thumbnails/index.png"), "rb")}
    
    thumbnailResponse1 = requests.post(url + 'upload-thumbnail', files=files).json()
    recipeData1 = getRecipeData1(thumbnailResponse1["value"], user1["token"])

    requests.post(url + 'update-recipe-info', json=recipeData1)

    likeData1 = {
        'recipeId': thumbnailResponse1['value'], 
        'token': 'invalid token'
    }

    response1 = json.loads(requests.put(url + 'like', json=likeData1).text)

    assert response1['msg'] == 'LIKE_FAILURE'
    assert response1['error'] == 'Invalid token'

def test_like_failure_on_invalid_recipe():
    reset_server()

    requests.post(url + 'signup', json={'username': 'user1', 'email': 'user1@gmail.com', 'password': '123'})
    user1 = json.loads(requests.post(url + 'login', json={'email': 'user1@gmail.com', 'password': '123'}).text)
    
    files = {'recipeThumbnail': open(os.path.join(os.path.dirname(__file__), "imgs/thumbnails/index.png"), "rb")}
    
    thumbnailResponse1 = requests.post(url + 'upload-thumbnail', files=files).json()
    recipeData1 = getRecipeData1(thumbnailResponse1["value"], user1["token"])

    requests.post(url + 'update-recipe-info', json=recipeData1)

    likeData1 = {
        'recipeId': 'invalid recipe', 
        'token': user1['token']
    }

    response1 = json.loads(requests.put(url + 'like', json=likeData1).text)

    assert response1['msg'] == 'LIKE_FAILURE'
    assert response1['error'] == 'Invalid recipe'

