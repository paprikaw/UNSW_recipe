import pytest
import requests
import json
from common import url, reset_server

def test_homepage():
    reset_server()

    response = requests.get(url).json()

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

def test_signup_success():
    reset_server()

    user1 = json.loads(requests.post(url + 'signup', json={'username': 'user1', 'email': 'user1@gmail.com', 'password': '123'}).text)
    user2 = json.loads(requests.post(url + 'signup', json={'username': 'user2', 'email': 'user2@gmail.com', 'password': '123'}).text)

    assert user1 == {}
    assert user2 == {}

def test_signup_failure_on_duplicate_email():
    reset_server()

    user1 = json.loads(requests.post(url + 'signup', json={'username': 'user1', 'email': 'user1@gmail.com', 'password': '123'}).text)
    user2 = json.loads(requests.post(url + 'signup', json={'username': 'user2', 'email': 'user1@gmail.com', 'password': '123'}).text)

    assert user1 == {}
    assert user2['error'] == 'Email already in use.'

def test_login_success():
    reset_server()
    user1 = json.loads(requests.post(url + 'signup', json={'username': 'user1', 'email': 'user1@gmail.com', 'password': '123'}).text)
    user1 = json.loads(requests.post(url + 'login', json={'email': 'user1@gmail.com', 'password': '123'}).text)
    assert user1['msg'] == 'LOGIN_SUCCESS'

def test_login_failure_on_nonexisting_email_address():
    reset_server()
    user1 = json.loads(requests.post(url + 'signup', json={'username': 'user1', 'email': 'user1@gmail.com', 'password': '123'}).text)
    user1 = json.loads(requests.post(url + 'login', json={'email': 'userXXX@gmail.com', 'password': '123'}).text)
    assert user1['error'] == 'Email does not exist'

def test_login_failure_on_invalid_password():
    reset_server()
    user1 = json.loads(requests.post(url + 'signup', json={'username': 'user1', 'email': 'user1@gmail.com', 'password': '123'}).text)
    user1 = json.loads(requests.post(url + 'login', json={'email': 'user1@gmail.com', 'password': '123XXX'}).text)
    assert user1['error'] == 'Password failure'