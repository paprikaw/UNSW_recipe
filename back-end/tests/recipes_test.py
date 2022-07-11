import pytest
import requests
import json
from common import url, reset_server

def test_upload_image_success():
    reset_server()

    files = {'recipeThumbnail': open("./imgs/thumbnails/index.png", "rb")}
    response = requests.post(url + 'upload-thumbnail', files=files)
    rjson = response.json()
    
    assert response.status_code == 200
    assert rjson['status'] == True
    assert rjson['msg'] == 'Image upload success'

# def test_upload_image_failure_on_no_file_specified():
#     reset_server()

#     files = {'recipeThumbnail': ''}
#     response = requests.post(url + 'upload-thumbnail', files=files)
#     rjson = response.json()

#     assert response.status_code == 200
#     assert rjson['status'] == False
#     assert rjson['msg'] == 'No File specified'

def test_upload_image_failure_on_file_type_not_supported():
    reset_server()

    files = {'recipeThumbnail': open("./text/test.txt", "rb")}
    response = requests.post(url + 'upload-thumbnail', files=files)
    rjson = response.json()

    assert response.status_code == 200
    assert rjson['status'] == False
    assert rjson['msg'] == 'Unsupported file type'

def test_upload_image_failure_on_duplicate_file_name():
    reset_server()
    files = {'recipeThumbnail': open("./imgs/thumbnails/index.png", "rb")}
    response1 = requests.post(url + 'upload-thumbnail', files=files)
    rjson1 = response1.json()

    files = {'recipeThumbnail': open("./imgs/thumbnails/index.png", "rb")}
    response2 = requests.post(url + 'upload-thumbnail', files=files)
    rjson2 = response2.json()

    assert response1.status_code == 200
    assert response2.status_code == 200
    assert rjson1['status'] == True
    assert rjson1['msg'] == 'Image upload success'
    assert rjson2['status'] == True
    assert rjson2['msg'] == 'Image upload success'
    assert rjson2['value'] > rjson1['value']