import os
from flask import request
from sqlalchemy import text

FOLDER_THUMBNAIL = os.path.abspath(os.path.join(os.path.dirname(__file__), 'static'))
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

'''
helpers
'''

def verifyFileType(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def verifyFileDuplicateName(filename):
    for _, _, files in os.walk(FOLDER_THUMBNAIL):
        if filename in files:
            return True

def getAccountIdFromToken(token, con):
    return con.execute(
        text('select accountId from AccountSessions where token = :userToken'),
        userToken = token
    ).fetchone()

def isRecipeLiked(token, recipeId, accountId, con):
    isLiked = con.execute(
        text('select * from RecipeLikes where recipeId = :recipeId and accountId = accountId'),
        recipeId = recipeId, accountId = accountId
    ).fetchone()

    if isLiked is None:
         return False
    return True

'''
routes
'''

def recipe_upload_thumbnail(db_engine):
    img = request.files['recipeThumbnail']
    path = ''
    filename = ''
    
    if (img and verifyFileType(img.filename)):
        if not verifyFileDuplicateName(img.filename):
            path = os.path.join(FOLDER_THUMBNAIL, img.filename)
            img.save(path)
            filename = img.filename
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
            filename = newFileName
        with db_engine.connect() as con:
            con.execute(text('insert into Recipes(thumbnailPath) values (:thumbnailPath)'), thumbnailPath=filename)
            result = con.execute(text('select recipeID from Recipes where thumbnailPath = :thumbnailPath'), thumbnailPath=filename).fetchall()
        return {
            'status': True,
            'recipeId': result[0][0],
            'thumbnail': filename,
            'msg': 'Image upload success'
        }
    else:
        return {
            'status': False,
            'recipeId': '',
            'thumbnail': '',
            'msg': 'Unsupported file type'
        } 

def remove_thumbnail(db_engine, directory):
    file = request.get_json()['thumbnail']

    with db_engine.connect() as con:
        # check thumbnail exists in database
        recipe = con.execute(
            text('select recipeId from Recipes where thumbnailPath = :thumbnailPath'),
            thumbnailPath = file
        ).fetchone()

        if recipe is None:
            return {
                'msg': 'REMOVE_THUMBNAIL_FAILURE',
                'error': 'Invalid thumbnail file name'
            }
        
        con.execute(
            text('delete from Recipes where recipeId = :recipeId'),
            recipeId = recipe[0]
        )

        # remove thumbnail file from local server
        os.remove(os.path.join(directory, file))

    return {
        'msg': 'REMOVE_THUMBNAIL_SUCCESS',
        'error': ''
    }

def recipe_update_remaining_info_at_creation(db_engine):
    MEAL_TYPE = {"Breakfast", "Lunch", "Dinner", "Dessert", "Snack", "Entree", "Main", "Tea"}

    recipeInfo = request.get_json()
    recipeId = recipeInfo['recipeId']
    recipeName = recipeInfo['recipeName']
    mealTypes = recipeInfo['mealType']
    cookTime = recipeInfo['cookTime']
    token = recipeInfo['token']
    ingredientList = recipeInfo['ingredients']
    steps = recipeInfo['steps']

    if (type(recipeName) != str):
        return {
            'status': False,
            'msg': 'Recipe should be string'
        }

    if not any(m in MEAL_TYPE for m in mealTypes):
        return {
            'status': False,
            'msg': 'Meal type is not right'
        }

    with db_engine.connect() as con:

        # Get account Id
        accountId = getAccountIdFromToken(token, con)
        # check valid token
        if accountId is None:
            return {
                'status': False,
                'error': 'Invalid token'
            }
            
        accountId = accountId[0]

        # filling up remaining columns in Recipes table
        con.execute(
            text('''
                update Recipes
                set recipeName = :recipeName, cookTime = :cookTime, accountId = :accountId
                where recipeId = :recipeId
                '''    
            ),
            recipeName = recipeName, cookTime = cookTime, 
            accountId = accountId, recipeId = recipeId
        )

        # add meal types
        for mealType in mealTypes:
            con.execute(
                text('insert into RecipeMealTypes(recipeId, mealType) values (:recipeId, :mealType)'),
                recipeId = recipeId, mealType = mealType
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
        
        # TODO: sprint 3, check if it is an existing NoResultsIngredientSets
        # if it is, remove entries from the table

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
    token = request.get_json()['token']

    if ingredientNames is None or len(ingredientNames) == 0:
        return recipesResult

    with db_engine.connect() as con:
        accountId = getAccountIdFromToken(token, con)

        # check valid token
        if accountId is None:
            return  recipesResult

        accountId = accountId[0]

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
                select Recipes.recipeId, recipeName, likes, cookTime, thumbnailPath, numIngredientsMatched 
                from IngredientsMatched left outer join Recipes on (IngredientsMatched.recipeId = Recipes.recipeId)
                order by numIngredientsMatched desc;
            ''')
        ).fetchall()

        for result in searchResults:
            mealTypes = []
            
            mealTypesResults = con.execute(
                text('select mealType from RecipeMealTypes where recipeId = :recipeId'),
                recipeId = result[0]
            ).fetchall()

            for m in mealTypesResults:
                mealTypes.append(m[0])

            recipes.append({
                'recipeId': result[0],
                'recipeName': result[1],
                'mealType': mealTypes,
                'likes': result[2],
                'cookTime': result[3], 
                'thumbnail': result[4],
                'numIngredientsMatched': result[5],
                'liked': isRecipeLiked(token, result[0], accountId, con)
            })

        # TODO sprint 3: update NoResultIngredientSets for empty searchResults
        # check if ingredient set is existing
        # set exists, increment hits
        # set does not exist, insert new set
        maxSetId = con.execute('select max(setId) from NoResultIngredientSets').fetchone()
        maxSetId = maxSetId[0] # extract id from tuple
        # init the setId == 1 if there's no record in the table
        if type(maxSetId) != int:
            maxSetId = 1
        ingreIdsInSearch = set(ingredientIds)
        ingreIdsInDb = set()
        existenceFlag = False
        for i in range(1, maxSetId + 1):
            ingreIdsInDb.clear()
            print(f"-------------------------- {i} ---------------------------")
            result = con.execute(
                text("""
                    select ingredientId from IngredientSets where setId = :setId
                """), setId = i
            ).fetchall()
            if len(result) != 0:
                for id in result:
                    ingreIdsInDb.add(id[0])

            difference = ingreIdsInSearch.symmetric_difference(ingreIdsInDb)
            if len(difference) != 0:
                print("=====  Diff =====")
                print(ingreIdsInSearch)
                print(ingreIdsInDb)
                pass
            else:
                print("=====  No Diff =====")
                existenceFlag = True
                con.execute(
                    text("""
                        update NoResultIngredientSets set hits = hits + 1 where setId = :setId
                    """), setId = i
                )
                break

        if not existenceFlag:
            con.execute(
                text("""
                    insert into NoResultIngredientSets(hits) values (1)
                """)
            )
            maxSetId = con.execute('select max(setId) from NoResultIngredientSets').fetchone()
            for id in ingredientIds:
                con.execute(
                    text("""
                        insert into IngredientSets (setId, ingredientId) values (:setId, :ingredientId)
                    """), 
                    setId = maxSetId[0], ingredientId = id
                )
            

    return recipesResult
    
def details(db_engine):
    recipe = {'recipe': {}}

    recipeId = request.get_json()['recipeId']
    token = request.get_json()['token']
    
    if recipeId is None:
        return recipe

    with db_engine.connect() as con:
        accountId = getAccountIdFromToken(token, con)

        # check valid token
        if accountId is None:
            return  recipe

        accountId = accountId[0]
        recipeResult = con.execute(
            text('''
                select recipeId, username, recipeName, cookTime, likes, thumbnailPath
                from Recipes left outer join Accounts on Recipes.accountId = Accounts.accountId
                where recipeId = :recipeId
            '''),
            recipeId = recipeId
        ).fetchone()

        if recipeResult is None:
            return recipe

        mealTypes = []
        
        mealTypesResults = con.execute(
            text('select mealType from RecipeMealTypes where recipeId = :recipeId'),
            recipeId = recipeId
        ).fetchall()

        for m in mealTypesResults:
            mealTypes.append(m[0])

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
            'mealType': mealTypes,
            'cookTime': recipeResult[3],
            'likes': recipeResult[4],
            'thumbnailPath': recipeResult[5],
            'ingredients': ingredients,
            'steps': steps,
            'liked': isRecipeLiked(token, recipeResult[0], accountId, con)
        }

    return {
        'recipe': recipe
    }

def like(db_engine):
    recipeId = request.get_json()['recipeId']
    token = request.get_json()['token']
    
    with db_engine.connect() as con:
        accountId = getAccountIdFromToken(token, con)

        # check valid token
        if accountId is None:
            return {
                'msg': 'LIKE_FAILURE',
                'error': 'Invalid token'
            }

        accountId = accountId[0]

        # check valid recipe        
        checkRecipe = con.execute(
            text('select * from Recipes where recipeId = :recipeId'),
            recipeId = recipeId
        ).fetchall()

        if len(checkRecipe) == 0:
            return {
                'msg': 'LIKE_FAILURE',
                'error': 'Invalid recipe'
            }

        # update likes
        con.execute(
            text('insert into RecipeLikes (recipeId, accountId) values (:recipeId, :accountId)'),
            recipeId = recipeId, accountId = accountId
        )

    return {
        'msg': 'LIKE_SUCCESS', 
        'error': ''
    }

def showTopThreeNoResultIngredientSets(db_engine):
    with db_engine.connect() as con:
        # search the top 3 hitted ingredient sets which has no matching recipes.
        ingredientSetIds =  con.execute(
            text('select setId, hits from NoResultIngredientSets order by hits desc limit 3')
        ).fetchall()

        result = []
        if len(ingredientSetIds) == 0:
            return {
                'ingredients': []
            }
        else:
            # find ingredientName for each set of unmatched Ingredient sets
            for setId in ingredientSetIds:
                ingredientNameSet = con.execute(
                    text("""
                    select ingredientName from Ingredients 
                    inner join IngredientSets on IngredientSets.ingredientId = Ingredients.ingredientId
                    where IngredientSets.setId := setId"""),
                    setId = setId
                ).fetchall()
                print(ingredientNameSet)
                result.append(ingredientNameSet)
            return {
                'ingredients': result 
            }