/* The login page start up code is from: https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/sign-in/SignIn.js */
import {} from 'antd';
import { React } from 'react';
import './index.scss';
import Thumbnail from '@/components/thumbnail';

const FoodOfTime = (props) => {
  const { recipes, onClick } = props;
  return (
    <>
      <h1>It's time for:</h1>
      <div>
        {recipes.map((recipe) => (
          <Thumbnail
            recipeId={recipe.recipeId}
            recipeName={recipe.recipeName}
            mealType={recipe.mealType}
            likes={recipe.likes}
            cookTime={recipe.cookTime}
            thumbnail={recipe.thumbnail}
            numIngredientsMatched={recipe.numIngredientsMatched}
            onClick={onClick}
          ></Thumbnail>
        ))}
      </div>
    </>
  );
};

/* Handler function */
export default FoodOfTime;
