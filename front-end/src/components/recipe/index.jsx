import { Button, Drawer, Avatar, Card, Typography } from 'antd';
import React, { useState } from 'react';
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const { Meta } = Card;
const { Text } = Typography;

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

  return (
    <Card
      bordered={false}
      style={{
        width: 300,
      }}
      cover={<img alt="example" src={thumbnailPath} />}
      actions={[
        // <SettingOutlined key="setting" />,
        <EditOutlined key="edit" />,
        <EllipsisOutlined key="ellipsis" />,
      ]}
    >
      <Meta
        className="user_recipe_info"
        // avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
        title={
          <Text>
            {recipeName} #{recipeId}
          </Text>
        }
        description={
          <Text>
            Devoted by {username} {likes}👍
          </Text>
        }
      />
      {/* <Card className ='small_card' size="small" title="Meal Type">
        <p>Card content</p>
      </Card> */}
    </Card>
  );
};

export default Recipe;

// title={recipeName}
// description={<Text>Devoted by {username}</Text> }
