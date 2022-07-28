import {
  Card,
  Select,
  InputNumber,
  Form,
  Button,
  Input,
  Typography,
  Slider,
  Row,
  Col,
  AutoComplete,
  message,
  Space,
} from 'antd';
import './index.scss';
/**
 * Component for contributor page to suggest input ingredient sets
 *
 * @component
 * @example
 * const ingredients = ['apple', 'pear']
 * return (
 *   <Contributor ingredients={ingredients} />
 * )
 */
const ingredient_set = [
  ['haha', 'niu', 'lihai'],
  ['haha', 'niu', 'lihai'],
  ['haha', 'niu', 'lihai'],
];

const IngredientSet = (props) => {
  const { ingredientSets = [], onClick } = props;
  return (
    <Card style={{ padding: '10px' }}>
      <h3>These ingredient sets need you!</h3>
      <div className="container">
        {ingredient_set.map((set, key) => (
          <Card
            style={{ paddingLeft: '10px' }}
            id="my-card"
            hoverable={true}
            onClick={onClick}
            key={key}
          >
            <div className="ingredient-element">{set.join(', ')}</div>
          </Card>
        ))}
      </div>
    </Card>
  );
};

export default IngredientSet;
