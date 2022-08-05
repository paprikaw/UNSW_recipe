import { Card, Typography, Image, Space, Divider } from 'antd';
import React from 'react';
import LikesButton from '../likesButton/likesButton';
import './index.scss';

const { Text } = Typography;
/**
 * * Component: Recipe detail page
 * @props recipe data
 */
const Recipe = (props) => {
  const {
    username,
    recipeId,
    recipeName,
    mealType,
    likes,
    cookTime,
    thumbnailPath,
    ingredients,
    steps,
    liked,
    onLikeChange,
  } = props;

  return (
    <>
      <div className="recipe_big_image">
        <Image width={'100%'} src={'/static/' + thumbnailPath} />
      </div>
      <div className="detail-page-container">
        <div className="header">
          <h1>{recipeName}</h1>
          <div className="likes">
            <LikesButton
              recipeId={recipeId}
              likes={likes}
              liked={liked}
              onLikeChange={onLikeChange}
            />
          </div>
        </div>
        <div style={{ textAlign: 'end' }}>
          <Text>Devoted by {username}</Text>
        </div>

        <Divider />
        <Space
          direction="vertical"
          style={{ width: '100%' }}
          className="content"
        >
          <div className="line">
            <h4 style={{ display: 'inline' }}>Meal Type: </h4>
            <Text>{mealType.join(', ')}</Text>
          </div>

          <div className="line">
            <h4 style={{ display: 'inline' }}>Cook Time: </h4>
            <Text>{cookTime} minutes</Text>
          </div>

          <h3>Ingredients needed:</h3>
          <Card size="default">
            {ingredients.map((dict) => (
              <div className="line">
                <Text>{dict.name}</Text>
                <Text>
                  {dict.quantity} {dict.unit}
                </Text>
              </div>
            ))}
          </Card>
          <h3>Steps:</h3>
          {steps.map((string, index) => (
            <Card size="default">
              <div className="line">
                <Text>
                  Step {index + 1}: {string}
                </Text>
              </div>
            </Card>
          ))}
        </Space>
      </div>
    </>
  );
};

export default Recipe;
