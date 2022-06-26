from datetime import datetime
from flask import Flask, request
from sqlalchemy import create_engine, text
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
        result = con.execute(text(
            'select * from Accounts where email = :email'), email=email
        ).fetchall()    
        if len(result) == 0:
            return {'error': 'Email does not exist'}
        
        accountId = result[0][0]
        pwInDb = result[0][3]
        if (passwordHash != pwInDb):
            return {'error': 'Password failure'}
        
        # construct the token based on accountID and the local time
        now = datetime.now()
        strToBeTokenized = str(accountId) + "@" + now.strftime("%X")
        token = sha256(strToBeTokenized.encode())
        con.execute(
            text('insert into AccountSessions(token, accountId) values (:token, :accountId)'), 
                token=token.hexdigest(), accountId=accountId
        )
    return {'msg':'LOGIN_SUCCESS'}