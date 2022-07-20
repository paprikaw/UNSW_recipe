import {
  Button,
  Drawer,
  Card,
  Typography,
  Image,
  Collapse,
  Space,
  Divider,
} from 'antd';
import React, { useState } from 'react';
import './index.scss';

import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { string } from 'prop-types';

const { Meta } = Card;
const { Text } = Typography;
const { Panel } = Collapse;

const Recipe = (props) => {
  const {
    recipeId,
    username,
    recipeName,
    mealType,
    likes,
    cookTime,
    thumbnailPath,
    ingredients,
    steps,
  } = props;

  const onChange = (key) => {
    console.log(key);
  };

  return (
    <>
      <div className="recipe_big_image">
        <Image width={'100%'} src={'/static/' + thumbnailPath} />
      </div>
      <div className="detail-page-container">
        <div className="header">
          <h1>{recipeName}</h1>
          <div className="likes">
            <Text>{likes}👍</Text>
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
            <Text>{mealType}</Text>
          </div>

          <div className="line">
            <h4 style={{ display: 'inline' }}>Cook Time: </h4>
            <Text>{cookTime} minutes</Text>
          </div>

          <h3>Ingredients needed:</h3>
          <Card size="default">
            {ingredients.map((dict, index) => (
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
// title={recipeName}
// description={<Text>Devoted by {username}</Text> }
