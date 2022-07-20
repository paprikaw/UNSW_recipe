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

def test_search_multiple_responses(setup_two_recipes):
    runningList = {'ingredients': ['Ground Beef', 'White Flour', 'Salt']}
    response = json.loads(requests.post(url + 'search', json=runningList).text)

    # should be arranged according to num ingredients matched
    assert response['recipes'][0]['recipeName'] == 'Beef pie'
    assert response['recipes'][1]['recipeName'] == 'No Salt Beef pie' 
    assert response['recipes'][0]['numIngredientsMatched'] == 3
    assert response['recipes'][1]['numIngredientsMatched'] == 2

def test_search_no_matches(setup_two_recipes):
    runningList = {'ingredients': ['Garlic', 'Onion', 'Potato']}
    response = json.loads(requests.post(url + 'search', json=runningList).text)

    assert len(response['recipes']) == 0

def test_details_valid_recipe_id(setup_two_recipes):
    response1 = json.loads(requests.get(url + 'details', params={'recipeId': 1}).text)
    response2 = json.loads(requests.get(url + 'details', params={'recipeId': 2}).text)

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

def test_details_invalid_recipe_id(setup_two_recipes):
    response1 = json.loads(requests.get(url + 'details', params={'recipeId': 3}).text)
    response2 = json.loads(requests.get(url + 'details', params={'recipeId': -1}).text)
    
    assert response1 == {'recipe': {}}
    assert response2 == {'recipe': {}}
