import pytest
import requests
import json
from common import url, reset_server

def test_signup_success():
    reset_server()

    user1 = json.loads(requests.post(url + 'sign_up', json={'username': 'user1', 'email': 'user1@gmail.com', 'password': '123'}).text)
    user2 = json.loads(requests.post(url + 'sign_up', json={'username': 'user2', 'email': 'user2@gmail.com', 'password': '123'}).text)

    assert user1 == {}
    assert user2 == {}

def test_signup_failure_on_duplicate_email():
    reset_server()

    user1 = json.loads(requests.post(url + 'sign_up', json={'username': 'user1', 'email': 'user1@gmail.com', 'password': '123'}).text)
    user2 = json.loads(requests.post(url + 'sign_up', json={'username': 'user2', 'email': 'user1@gmail.com', 'password': '123'}).text)

    assert user1 == {}
    assert user2['error'] == 'Email already in use.'
