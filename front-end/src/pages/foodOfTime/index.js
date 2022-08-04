/* The login page start up code is from: https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/sign-in/SignIn.js */
import { Typography, Spin, Divider } from 'antd';
import { React, useEffect, useState } from 'react';
import Thumbnail from '@/components/thumbnail';
import { useFetch } from '@/utils/useFetch';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { curMealType } from '@/utils/utils';
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

const FoodOfTime = (props) => {
  const { top3Recipe, onClick, top3RecipeLoading } = props;
  return (
    <>
      {top3RecipeLoading ? (
        <Spin />
      ) : (
        <>
          <Title level={2}>It's time for {curMealType()[0]}... </Title>
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
                    onClick={onClick}
                    isHome={false}
                  ></Thumbnail>
                </div>
              ))}
          </Carousel>
          <p></p>
          <Divider />
          <p></p>
        </>
      )}
    </>
  );
};

/* Handler function */
export default FoodOfTime;
