import os
from flask import request
from sqlalchemy import text

FOLDER_THUMBNAIL = os.path.abspath(os.path.join(os.path.dirname(__file__), 'imgs/thumbnails'))
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
    MEAL_TYPE = {"Breakfast", "Lunch", "Dinner", "Dessert", "Snack", "Entry", "Main","Tea"}

    recipeInfo = request.get_json()
    recipeId = recipeInfo['recipeId']
    recipeName = recipeInfo['recipeName']
    mealType = recipeInfo['mealType']
    cookTime = recipeInfo['cookTime']
    token = recipeInfo['token']
    ingredientList = recipeInfo['ingredients']
    steps = recipeInfo['steps']

    if (type(recipeName) != str):
        return {
            'status': False,
            'msg': 'Recipe should be string'
        }

    if (mealType not in MEAL_TYPE):
        return {
            'status': False,
            'msg': 'Meal type is not right'
        }

    with db_engine.connect() as con:

        # Get account Id
        accountId = con.execute(
            text('select accountId from AccountSessions where token = :userToken'),
            userToken = token
        ).fetchone()[0]

        # filling up remaining columns in Recipes table
        con.execute(
            text('''
                update Recipes
                set recipeName = :recipeName , mealType = :mealType, cookTime = :cookTime, accountId = :accountId
                where recipeId = :recipeId
                '''    
            ),
            recipeName = recipeName, mealType = mealType, cookTime = cookTime, 
            accountId = accountId, recipeId = recipeId, steps = steps
        )

        # search ingredientId based on their names in db
        for ingreInfo in ingredientList:
            result = con.execute(
                text('select ingredientId from Ingredients where ingredientName = :ingre'),
                ingre = ingreInfo['name']
            ).fetchone()
            ingreId = result[0]

            # update ingredients info for the given recipe
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

            # update uses
            con.execute(
                text("update Ingredients set numUses = numUses + 1 where ingredientId = :ingredientId"),
                ingredientId = ingreId
            )
        
        # insert steps
        for step in steps:
            con.execute(
                text('insert into RecipeSteps(recipeId, step) values(:recipeId, :step)'),
                recipeId = recipeId, step = step
            )
        
        # TODO: check if it is an existing noResultsIngredientSets to decrement
        # In sprint3

    return {
        'status': True,
        'msg': 'Recipe submitted'
    }    

def search(db_engine):
    recipes = []
    recipesResult = {
        'recipes': recipes
    }

    ingredientNames = request.get_json()['ingredients']

    if len(ingredientNames) == 0:
        return recipesResult

    with db_engine.connect() as con:
        ingredientIds = []
        # get ingredient ids from running list
        ingredients = con.execute(
            text('select Ingredients.ingredientId from Ingredients where ingredientName in :ingredientName'), 
            ingredientName = tuple(ingredientNames)
        ).fetchall()

        for i in ingredients:
            ingredientIds.append(i[0])

        if len(ingredientIds) == 0:
            return recipesResult

        # create view based on ingredients matched
        con.execute(
            text('''
                create or replace view IngredientsMatched as
                select recipeId, count(recipeId) as numIngredientsMatched 
                from RecipeIngredients 
                where ingredientId in :ingredientIds 
                group by recipeId 
                order by count(recipeId) desc
            '''),
            ingredientIds = tuple(ingredientIds)
        )

        # get recipes that have matches
        searchResults = con.execute(
            text('''
                select Recipes.recipeId, recipeName, mealType, likes, cookTime, thumbnailPath, numIngredientsMatched 
                from IngredientsMatched left outer join Recipes on (IngredientsMatched.recipeId = Recipes.recipeId) 
                order by numIngredientsMatched desc;
            ''')
        ).fetchall()

        for result in searchResults:
            recipes.append({
                'recipeId': result[0],
                'recipeName': result[1],
                'mealType': result[2],
                'likes': result[3],
                'cookTime': result[4], 
                'thumbnail': result[5],
                'numIngredientsMatched': result[6]
            })

        # TODO sprint 3: update NoResultIngredientSets for empty searchResults
        # check if ingredient set is existing
        # set exists, increment hits
        # set does not exist, insert new set

    return recipesResult
    
def details(db_engine):
    recipe = {'recipe': {}}

    recipeId = request.args.get('recipeId')

    with db_engine.connect() as con:
        recipeResult = con.execute(
            text('''
                select recipeId, username, recipeName, mealType, cookTime, likes, thumbnailPath
                from Recipes left outer join Accounts on Recipes.accountId = Accounts.accountId
                where recipeId = :recipeId
            '''),
            recipeId = recipeId
        ).fetchone()

        if recipeResult is None:
            return recipe

        ingredients = []

        ingredientsResult = con.execute(
            text('''
                select ingredientName, quantity, unit
                from Recipes left outer join RecipeIngredients on Recipes.recipeId = RecipeIngredients.recipeId
                left outer join Ingredients on RecipeIngredients.ingredientId = Ingredients.ingredientId
                where Recipes.recipeId = :recipeId
            '''),
            recipeId = recipeId
        ).fetchall()

        for ingredient in ingredientsResult:
            ingredients.append({
                'name': ingredient[0],
                'quantity': ingredient[1],
                'unit': ingredient[2]
            })

        steps = []

        stepsResult = con.execute(
            text('''
                select step
                from Recipes left outer join RecipeSteps on Recipes.recipeId = RecipeSteps.recipeId
                where Recipes.recipeId = :recipeId
                order by stepId asc
            '''),
            recipeId = recipeId
        ).fetchall()

        for step in stepsResult:
            steps.append(step[0])
    
        recipe = {
            'recipeId': recipeResult[0],
            'username': recipeResult[1],
            'recipeName': recipeResult[2],
            'mealType': recipeResult[3],
            'cookTime': recipeResult[4],
            'likes': recipeResult[5],
            'thumbnailPath': recipeResult[6],
            'ingredients': ingredients,
            'steps': steps
        }

    return {
        'recipe': recipe
    }
