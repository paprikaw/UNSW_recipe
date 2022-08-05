import { Card, Typography } from 'antd';
import {
  FileSearchOutlined,
  FieldTimeOutlined,
  LikeFilled,
} from '@ant-design/icons';
import { React } from 'react';
import './index.scss';
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
    onClick,
    isHome = true,
  } = props;

  return (
    <Card
      hoverable
      cover={<img alt={recipeName} src={thumbnail} />}
      style={{ minWidth: '180px' }}
      className="recipe-thumbnail"
      key={recipeId}
      onClick={() => onClick(recipeId)}
    >
      <div className="thumbnail-header-box">
        <div className="header">
          <Text>{recipeName}</Text>
        </div>
        <div className="likes">
          <Text>
            {likes} <LikeFilled />
          </Text>
        </div>
      </div>

      <Text className="thumbnail-mealtype" type="primary">
        {mealType}
      </Text>
      <div className="thumbnail-content">
        {isHome && (
          <div className="line">
            <FileSearchOutlined />
            <Text className="description" type="primary">
              {numIngredientsMatched} matched ingredients
            </Text>
          </div>
        )}
        <div className="line">
          <FieldTimeOutlined />
          <Text className="description" type="primary">
            {cookTime} minutes to cook
          </Text>
        </div>
      </div>
    </Card>
  );
};

export default Thumbnail;
