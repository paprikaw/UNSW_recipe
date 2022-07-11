import os
from datetime import datetime
from flask import request
from sqlalchemy import text

FOLDER_THUMBNAIL = './upload'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def recipe_upload_thumbnail(db_engine):
    img = request.files['recipeThumbnail']
    #accountID = request.form['accountID']
    if img.filname == '':
        return {
            'status': False,
            'value': '',
            'msg': 'No File specified'
        }
    if (img and verifyFileType(img.filename)):
        if not verifyFileDuplicateName(img.filename):
            path = os.path.join(FOLDER_THUMBNAIL, img.filename)
            img.save(path)

        with db_engine.connect() as con:
            con.execute(text('insert into Recipes(thumbnailPath) values (:path)'))
            result = con.execute(text('select recipeID from Recipes where thumbnailPath = :path', path=path))
        print(result)
        return {
            'status': True,
            'value': result,
            'msg': 'Image upload success'
        }
    else:
        return {
            'status': False,
            'value': '',
            'msg': 'Unsupported file type'
        } 

def verifyFileType(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def verifyFileDuplicateName(filename):
    for root, dirs, files in os.walk(FOLDER_THUMBNAIL):
        if filename in files:
            return True

def create_recipe(db_engine):
    #recipeInfo = request.form[]
    recipeThumbnail = request.files['Thumbnail']
