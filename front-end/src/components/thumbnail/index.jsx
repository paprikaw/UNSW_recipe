import { Card, Select, Input, Typography, Row, Col } from 'antd';

import { DeploymentUnitOutlined, HourglassOutlined } from '@ant-design/icons';
import { React, useState } from 'react';
import UploadPicture from '../upload/UploadPicture';
import './index.scss';
const { Meta } = Card;
const { Text } = Typography;
/**
 *
 * Component for contributor page
 *
 * @component
 * @example
 * const data = {
 *   'recipeId': 1,
 *   'recipeName': Martini,
 *    'mealType': cocktail,
 *    'likes': 100,
 *    'cookTime': 5,
 *    'thumbnail': path-to-thumbnail,
 *    'numIngredientsMatched': 4
 * }
 * return (
 *   <Thumbnail data={data} />
 * )
 */
const Thumbnail = (props) => {
  const {
    recipeId,
    recipeName,
    mealType,
    likes,
    cookTime,
    thumbnail,
    numIngredientsMatched,
  } = props;
  // const onFinish = (values) => {
  //   if (recipeId !== -1) {
  //     values.recipeId = recipeId;
  //     processContributeVal(values);
  //     const requestOptions = {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(values),
  //     };

  //     fetch('/update-recipe-info', requestOptions)
  //       .then((v) => {
  //         return v.json();
  //       })
  //       .then((data) => {
  //         console.log(data);
  //       })
  //       .catch((e) => console.log(e));
  //   }
  // };

  return (
    <Card
      hoverable
      cover={<img alt={recipeName} src={thumbnail} />}
      style={{ minWidth: '180px' }}
      className="recipe-thumbnail"
      key={recipeId}
    >
      <div className="thumbnail-header-box">
        <div className="header">
          <Text>{recipeName}</Text>
        </div>
        <div className="likes">
          <Text>{likes} 👍</Text>
        </div>
      </div>

      <Text className="thumbnail-mealtype" type="primary">
        {mealType}
      </Text>
      <div className="thumbnail-content">
        <div className="line">
          <DeploymentUnitOutlined />
          <Text className="description" type="primary">
            {numIngredientsMatched} matched ingredients
          </Text>
        </div>
        <div className="line">
          <HourglassOutlined />
          <Text className="description" type="primary">
            {cookTime} minutes to cook
          </Text>
        </div>
      </div>
    </Card>
  );
};

export default Thumbnail;
