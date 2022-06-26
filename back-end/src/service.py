from datetime import datetime
from flask import Flask, request
from sqlalchemy import create_engine, text

def serv_login(db_engine):
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
        
        # now = datetime.now()
        # now.strftime("%X")
        # accountId
        # # con.execute(
        # #     text('insert into AccountSessions(token, accountId) values (:sessionId, :token, :accountId)'), 
        # #     token=token, accountId=accountId
        # # )
        return {'msg':'LOGIN_SUCCESS'}