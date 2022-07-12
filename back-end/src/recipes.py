import os
from datetime import datetime
from statistics import median_low
from flask import request
from sqlalchemy import text

FOLDER_THUMBNAIL = './imgs/thumbnails'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def recipe_upload_thumbnail(db_engine):
    img = request.files['recipeThumbnail']
    path = ''
    
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

def recipe_update_remaining_info_at_creation(db_engine):
    MEAL_TYPE = {"breakfast", "lunch", "dinner", "supper", "desert"}
    
    recipeInfo = request.get_json()
    recipeId = recipeInfo['recipeId']
    recipeName = recipeInfo['recipeName']
    mealType = recipeInfo['mealType']
    cookTime = recipeInfo['cookTime']
    accountId = recipeInfo['accountId']
    ingredientList = recipeInfo['ingredients']

    if (type(recipeName) != str or mealType not in MEAL_TYPE):
        return {
            'status': False,
            'msg': 'Data type not supported'
        }

    with db_engine.connect() as con:
        # filling up remaining columns in Recipes table
        con.execute(
            text('''
                update Recipes
                set recipeName = :recipeName , mealType = :mealType, cookTime = :cookTime, accountId = :accountId
                where recipeId = :recipeId
                '''    
            ),
            recipeName = recipeName, mealType = mealType, cookTime = cookTime, 
            accountId = accountId, recipeId = recipeId
        )
        # search ingredientId based on their names in db
        ingredientIdSet = []
        for ingreInfo in ingredientList:
            result = con.execute(
                text('select ingredientId from Ingredients where ingredientName = :ingre'),
                ingre = ingreInfo['name']
            ).fetchone()
            ingredientIdSet.append(result[0])

        # TODO: check if it is an existing noResultsIngredientSets
        # In sprint3

        # update ingredients info for the given recipe
        for ingreId in ingredientIdSet:    
            con.execute(
                text(
                    """
                    insert into RecipeIngredients(recipeId, ingredientId, quantity, unit)
                    values (:recipeId, :ingredientId, :quantity, :unit)
                    """
                ),
                recipeId = recipeId, ingredientId = ingreId, 
                quantity = ingreInfo['quantity'], unit = ingreInfo['unit']
            )
    return {
        'status': True,
        'msg': 'Recipe submitted'
    }    
    
        