import { Button, Drawer, Card, Typography, Image, Collapse } from 'antd';
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
        <Image
          width={338}
          src="https://cp1.douguo.com/upload/caiku/3/1/d/yuan_3168b8c616522ae87e246cf7a559271d.jpg"
        />
      </div>

      <div className="likes">
        <Text>{likes}👍</Text>
      </div>
      <div>
        <Text>Devoted by {username}</Text>
      </div>
      <div>
        <Card
          size="default"
          title="Meal Type"
          style={{
            width: 300,
          }}
        >
          <Text>{mealType}</Text>
        </Card>
        <Card
          size="default"
          title="Ingredients needed"
          style={{
            width: 300,
          }}
        >
          {ingredients.map((dict, index) => (
            <Text>
              <p> {dict.name} </p>
              <p class="ingredients_quantity">
                {dict.quantity}
                {dict.unit}
              </p>
            </Text>
          ))}
        </Card>
        <Card
          size="default"
          title="Instructions"
          style={{
            width: 300,
          }}
        >
          <Collapse
            bordered={false}
            defaultActiveKey={['1', '2', '3']}
            onChange={onChange}
          >
            {steps.map((string, index) => (
              <Text>
                <p>{string}</p>
              </Text>
            ))}
          </Collapse>
        </Card>
      </div>
    </>
  );
};

export default Recipe;
// title={recipeName}
// description={<Text>Devoted by {username}</Text> }
