import pytest
import requests
import json
import os
from common import url, reset_server, getRecipeData1, getRecipeData2

def test_signup_success():
    reset_server()

    user1 = json.loads(requests.post(url + 'signup', json={'username': 'user1', 'email': 'user1@gmail.com', 'password': '123'}).text)
    user2 = json.loads(requests.post(url + 'signup', json={'username': 'user2', 'email': 'user2@gmail.com', 'password': '123'}).text)

    assert user1, user2 == {
        'msg': 'SIGNUP_SUCCESS',
        'error': ''
    }

def test_signup_failure_on_duplicate_email():
    reset_server()

    user1 = json.loads(requests.post(url + 'signup', json={'username': 'user1', 'email': 'user1@gmail.com', 'password': '123'}).text)
    user2 = json.loads(requests.post(url + 'signup', json={'username': 'user2', 'email': 'user1@gmail.com', 'password': '123'}).text)

    assert user1 == {
        'msg': 'SIGNUP_SUCCESS',
        'error': ''
    }
    assert user2 == {
        'msg': 'SIGNUP_FAILURE',
        'error': 'Email already in use'
    }

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

def test_logout_success():
    reset_server()

    requests.post(url + 'signup', json={'username': 'user1', 'email': 'user1@gmail.com', 'password': '123'})
    token = json.loads(requests.post(url + 'login', json={'email': 'user1@gmail.com', 'password': '123'}).text)['token']
    user1 = json.loads(requests.delete(url + 'logout', json={'token': token}).text)

    assert user1 == {
        'msg': 'LOGOUT_SUCCESS',
        'error': ''
    }

def test_logout_failure_on_invalid_token():
    reset_server()

    requests.post(url + 'signup', json={'username': 'user1', 'email': 'user1@gmail.com', 'password': '123'})
    requests.post(url + 'login', json={'email': 'user1@gmail.com', 'password': '123'})
    user1 = json.loads(requests.delete(url + 'logout', json={'token': 'invalid token'}).text)

    assert user1 == {
        'msg': 'LOGOUT_FAILURE',
        'error': 'Invalid token'
    }
