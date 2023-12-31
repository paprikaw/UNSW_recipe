from datetime import datetime
from flask import request
from sqlalchemy import text
from hashlib import sha256

'''
helper(s)
'''

def getAccountIdFromToken(token, con):
    return con.execute(
        text('select accountId from AccountSessions where token = :userToken'),
        userToken = token
    ).fetchone()

''''''

def signup(db_engine):
    payload = request.get_json()
    username = payload['username']
    email = payload['email']
    passwordHash = payload['password']

    with db_engine.connect() as con:
        result = con.execute(text('select * from Accounts where email = :email'), email=email).fetchall()
        if len(result) > 0:
            return {
                'msg': 'SIGNUP_FAILURE',
                'error': 'Email already in use'
            }
        con.execute(
            text('insert into Accounts(username, email, password) values (:username, :email, :password)'), 
            username=username, email=email, password=passwordHash
        )

    return {
        'msg': 'SIGNUP_SUCCESS', 
        'error': ''
    }

def login(db_engine):
    '''
    sign in an existing user
    return error message on incorrect email address or incorrect password
    return success message on success
    '''
    payload = request.get_json()
    email = payload['email']
    passwordHash = payload['password']

    with db_engine.connect() as con:
        returnMSG = {
            'msg': 'LOGIN_FAILURE',
            'error': '',
            'token': ''
        }
        result = con.execute(text(
            'select * from Accounts where email = :email'), email=email
        ).fetchall()    
        if len(result) == 0:
            returnMSG['error'] = 'Email does not exist'
            return returnMSG
        
        accountId = result[0][0]
        pwInDb = result[0][3]
        if (passwordHash != pwInDb):
            returnMSG['error'] = 'Password failure'
            return returnMSG
                    
        # construct the token based on accountID and the local time
        now = datetime.now()
        strToBeTokenized = str(accountId) + "@" + now.strftime("%X")
        token = sha256(strToBeTokenized.encode())
        token = token.hexdigest()
        con.execute(
            text('insert into AccountSessions(token, accountId) values (:token, :accountId)'), 
                token=token, accountId=accountId
        )
        returnMSG['msg'] = 'LOGIN_SUCCESS'
        returnMSG['token'] = token

    return returnMSG

def logout(db_engine):
    token = request.get_json()['token']

    with db_engine.connect() as con:
        accountId = getAccountIdFromToken(token, con)
        if accountId is None:
            return {
                'msg': 'LOGOUT_FAILURE',
                'error': 'Invalid token'
            }
        
        con.execute(
            text('delete from AccountSessions where token = :token'),
            token=token
        )
            
    return {
        'msg': 'LOGOUT_SUCCESS',
        'error': ''
    }
    
def authenticate(db_engine):
    token = request.get_json()['token']

    with db_engine.connect() as con:
        accountId = getAccountIdFromToken(token, con)
        if accountId is None:
            return {
                'authenticate': False
            }
        
    return {
        'authenticate': True
    }