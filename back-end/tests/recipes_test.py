import pytest
import requests
import json
from common import url, reset_server

# def test_upload_image_success():
#     reset_server()

#     files = {'recipeThumbnail': open("./imgs/thumbnails/index.png", "rb")}
#     response = requests.post(url + 'upload-thumbnail', files=files)
#     rjson = response.json()
    
#     assert response.status_code == 200
#     assert rjson['status'] == True
#     assert rjson['msg'] == 'Image upload success'

# def test_upload_image_failure_on_file_type_not_supported():
#     reset_server()

#     files = {'recipeThumbnail': open("./text/test.txt", "rb")}
#     response = requests.post(url + 'upload-thumbnail', files=files)
#     rjson = response.json()

#     assert response.status_code == 200
#     assert rjson['status'] == False
#     assert rjson['msg'] == 'Unsupported file type'

# def test_upload_image_success_on_duplicate_file_name():
#     reset_server()
#     files = {'recipeThumbnail': open("./imgs/thumbnails/index.png", "rb")}
#     response1 = requests.post(url + 'upload-thumbnail', files=files)
#     rjson1 = response1.json()

#     files = {'recipeThumbnail': open("./imgs/thumbnails/index.png", "rb")}
#     response2 = requests.post(url + 'upload-thumbnail', files=files)
#     rjson2 = response2.json()

#     assert response1.status_code == 200
#     assert response2.status_code == 200
#     assert rjson1['status'] == True
#     assert rjson1['msg'] == 'Image upload success'
#     assert rjson2['status'] == True
#     assert rjson2['msg'] == 'Image upload success'
#     assert rjson2['value'] > rjson1['value']

def test_update_success():
    reset_server()
    user1 = json.loads(requests.post(url + 'signup', json={'username': 'user1', 'email': 'user1@gmail.com', 'password': '123'}).text)
    user1 = json.loads(requests.post(url + 'login', json={'email': 'user1@gmail.com', 'password': '123'}).text)
    
    files = {'recipeThumbnail': open("./imgs/thumbnails/index.png", "rb")}
    response2 = requests.post(url + 'upload-thumbnail', files=files)
    rjson2 = response2.json()
    print('recipeId: ' + str(rjson2["value"]))
    print('accountId: ' + str(user1["data"]["accountId"]))

    jsonData = {
        "recipeId": rjson2["value"],
        "recipeName": "Beef pie",
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

    retult = json.loads(requests.post(url + 'update-recipe-info', json=jsonData).text)
    assert retult['status'] == True

def test_update_failure_on_invalid_recipeName():
    reset_server()
    user1 = json.loads(requests.post(url + 'signup', json={'username': 'user1', 'email': 'user1@gmail.com', 'password': '123'}).text)
    user1 = json.loads(requests.post(url + 'login', json={'email': 'user1@gmail.com', 'password': '123'}).text)
    
    files = {'recipeThumbnail': open("./imgs/thumbnails/index.png", "rb")}
    response2 = requests.post(url + 'upload-thumbnail', files=files)
    rjson2 = response2.json()
    print('recipeId: ' + str(rjson2["value"]))
    print('accountId: ' + str(user1["data"]["accountId"]))

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

    retult = json.loads(requests.post(url + 'update-recipe-info', json=jsonData).text)
    assert retult['status'] == False