import os
from sqlalchemy import text
import sqlparse

__location__ = os.path.realpath(
    os.path.join(os.getcwd(), os.path.dirname(__file__)))

def category(db_engine): 
    '''
    returns the categories and their ingredients ordered by number of uses, and then alphabetically
    in the form: {'CategoryName': ['emoji IngredientName1', 'emoji IngredientName2', ...], ...}
    '''
    response = {}
    with db_engine.connect() as con:
        result = con.execute(text('''
            select Categories.categoryName, group_concat(Ingredients.emoji, ' ', Ingredients.ingredientName 
                order by Ingredients.numUses desc, Ingredients.ingredientName asc separator ',') 
            from Categories left outer join Ingredients on Categories.categoryId = Ingredients.categoryId 
            group by Categories.categoryName
        ''')).fetchall()
        for row in result:
            response[row[0]] = [ingredient for ingredient in row[1].split(',')]

    return response

def top10(db_engine):
    '''
    returns the top 10 most frequently used ingredients (regardless of categories) 
    ordered by number of uses, and then alphabetically in the form:
    {'ingredients': ['🧄 Garlic', ...]}
    '''
    ingredients = []

    with db_engine.connect() as con:
        ingredientsResult = con.execute(text('''
            select concat(emoji, ' ', ingredientName) 
            from Ingredients 
            order by numUses desc, ingredientName asc limit 10
        ''')).fetchall()

        for ingredient in ingredientsResult:
            ingredients.append(ingredient[0])
    
    return {'ingredients': ingredients}

def reset(db_engine):
    '''
    resets the database
    returns empty dict
    '''
    with db_engine.connect() as con:
        with open(os.path.join(__location__, 'schema.sql')) as schema:
            queries = sqlparse.split(sqlparse.format(schema.read(), strip_comments=True, reindent=True))
            for query in queries:
                con.execute(text(query))

    thumbnails = os.path.abspath(
        os.path.join(os.path.dirname(os.path.dirname(__file__)),'src/static')
    )
    
    for file in os.scandir(thumbnails):
        if not file.path.endswith('/.gitignore'):
            os.remove(file.path)

    return {}