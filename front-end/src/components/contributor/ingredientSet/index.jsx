import { Card } from 'antd';
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
const IngredientSet = (props) => {
  const { ingredientSets = [], onClick } = props;
  return (
    <Card style={{ padding: '10px' }}>
      <h3>These ingredient sets need you!</h3>
      <div className="container">
        {ingredientSets.map((set, key) => (
          <Card
            style={{ paddingLeft: '10px' }}
            id="my-card"
            hoverable={true}
            onClick={() => onClick(set)}
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
