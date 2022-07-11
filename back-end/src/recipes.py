import os
from datetime import datetime
from flask import request
from sqlalchemy import text

FOLDER_THUMBNAIL = './imgs/thumbnails'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def recipe_upload_thumbnail(db_engine):
    img = request.files['recipeThumbnail']
    path = ''
    #accountID = request.form['accountID']
    # if img.filename == '':
    #     return {
    #         'status': False,
    #         'value': '',
    #         'msg': 'No File specified'
    #     }
    if (img and verifyFileType(img.filename)):
        if not verifyFileDuplicateName(img.filename):
            path = os.path.join(FOLDER_THUMBNAIL, img.filename)
            img.save(path)
        else:
            nameSuffix = 0
            for _,_,files in os.walk(FOLDER_THUMBNAIL):
                for file in files:
                    if(file.startswith(img.filename)):
                        nameSuffix+=1
            splited = img.filename.split(".")
            newFileName = splited[0] + str(nameSuffix) + "." + splited[1]
            path = os.path.join(FOLDER_THUMBNAIL, newFileName)
            img.save(path)
        with db_engine.connect() as con:
            con.execute(text('insert into Recipes(thumbnailPath) values (:thumbnailPath)'), thumbnailPath=path)
            result = con.execute(text('select recipeID from Recipes where thumbnailPath = :thumbnailPath'), thumbnailPath=path).fetchall()
        print(result[0][0])
        return {
            'status': True,
            'value': result[0][0],
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
    for _, _, files in os.walk(FOLDER_THUMBNAIL):
        if filename in files:
            return True

def create_recipe(db_engine):
    #recipeInfo = request.form[]
    recipeThumbnail = request.files['Thumbnail']
