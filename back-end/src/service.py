from datetime import datetime
from telnetlib import SGA
from flask import request
from sqlalchemy import text
from hashlib import sha256

def serv_login(db_engine):
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
            'data': {
                'accountId': '',
                'token': '',
            }
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
        returnMSG['data']['accountId'] = accountId
        returnMSG['data']['token'] = token

    return returnMSG