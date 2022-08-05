import { React } from 'react';
import useCollapse from 'react-collapsed';
import { Card, Button, Space } from 'antd';
import SelectButton from './selectButton';
import './index.scss';

/**
 * * Component: Ingridents Category Box - collapsible
 * @data ingredients data
 * @title category name
 * @selectState
 * @onClick on click action
 */
function CollapseBox(props) {
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse({
    collapsedHeight: '80',
  });
  const { data, title, selectState, onClick } = props;

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
      <div style={{ height: '300px' }} {...getCollapseProps()}>
        <Space size={[8, 16]} wrap>
          {data.map((name) => {
            return (
              <SelectButton
                selectState={selectState}
                buttonText={name}
                categoryKey={title}
                onClick={() => onClick(name)}
              />
            );
          })}
        </Space>
      </div>
    </Card>
  );
}

export default CollapseBox;
