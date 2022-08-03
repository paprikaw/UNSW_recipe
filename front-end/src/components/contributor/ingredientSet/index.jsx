import { Card, Spin } from 'antd';
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
  const { ingredientSets = [], onClick, isLoading = true } = props;
  return (
    <Card style={{ padding: '10px' }}>
      {isLoading ? (
        <Spin />
      ) : (
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
      )}
    </Card>
  );
};

export default IngredientSet;
