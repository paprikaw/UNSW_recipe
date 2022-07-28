import { React } from 'react';
import useCollapse from 'react-collapsed';
import { Card, Button, Spin, Space } from 'antd';
import SelectButton from './selectButton';
import './index.scss';

/**
 * Component for category page to suggest ingredient input
 *
 * @component
 * @example
 * const ingredients = {
 *    apple: true,
 *    pear: false
 * }
 * return (
 *   <CollapseBox data={ingredients} onClick=() title/>
 * )
 */
function SuggestionBox(props) {
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse({
    collapsedHeight: '80',
  });

  const { data, title, onClick } = props;

  return (
    <Card
      title={title}
      hoverable={true}
      className="collapse-card"
      style={{ margin: '0 auto' }}
      actions={[
        <Button {...getToggleProps()} type="link">
          {isExpanded ? 'Collapse' : 'Expand'}
        </Button>,
      ]}
    >
      <div style={{ height: '200px' }} {...getCollapseProps()}>
        <Space size={[8, 16]} wrap>
          {Object.entries(data).map(([name, isShow]) => {
            return (
              isShow && (
                <SelectButton
                  buttonText={name}
                  categoryKey={title}
                  onClick={() => onClick(name)}
                />
              )
            );
          })}
        </Space>
      </div>
    </Card>
  );
}

export default SuggestionBox;
