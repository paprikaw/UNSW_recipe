/* The login page start up code is from: https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/sign-in/SignIn.js */
import { Typography, Spin } from 'antd';
import { React, useEffect, useState } from 'react';
import Thumbnail from '@/components/thumbnail';
import { useFetch } from '@/utils/useFetch';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
const { Title } = Typography;
const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 3, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 2, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
};

const curMealType = () => {
  const cur_hour = new Date().getHours();
  if (cur_hour <= 10 && cur_hour > 6) {
    return ['breakfast'];
  } else if (cur_hour <= 12 && cur_hour > 10) {
    return ['tea', 'snack', 'dessert'];
  } else if (cur_hour <= 14 && cur_hour > 12) {
    return ['lunch'];
  } else if (cur_hour <= 17 && cur_hour > 14) {
    return ['tea', 'snack', 'dessert'];
  } else if (cur_hour <= 20 && cur_hour > 17) {
    return ['dinner'];
  } else if (
    (cur_hour < 24 && cur_hour > 17) ||
    (cur_hour >= 0 && cur_hour <= 6)
  ) {
    return ['tea', 'snack', 'dessert'];
  }
};

const FoodOfTime = (props) => {
  const foodOfTimeBody = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mealTypes: curMealType() }),
  };

  const [top3Recipe, top3RecipeLoading] = useFetch(
    '/topThreeLikedRecipesOnMealType',
    (data) => data.recipes,
    foodOfTimeBody,
    []
  );

  useEffect(() => {
    console.log(top3Recipe);
  }, [top3Recipe]);

  const { onClick } = props;
  return (
    <>
      {top3RecipeLoading ? (
        <Spin />
      ) : (
        <>
          <Title level={2}>It's time for {curMealType()[0]}: </Title>
          <Carousel responsive={responsive}>
            {top3Recipe &&
              top3Recipe.map((recipe) => (
                <div style={{ padding: '20px' }}>
                  <Thumbnail
                    recipeId={recipe.recipeId}
                    recipeName={recipe.recipeName}
                    mealType={recipe.mealType}
                    likes={recipe.likes}
                    cookTime={recipe.cookTime}
                    thumbnail={'/static/' + recipe.thumbnail}
                    numIngredientsMatched={recipe.numIngredientsMatched}
                    onClick={onClick}
                    isHome={false}
                  ></Thumbnail>
                </div>
              ))}
          </Carousel>
        </>
      )}
    </>
  );
};

/* Handler function */
export default FoodOfTime;
