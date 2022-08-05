import { React } from 'react';
import { Button } from 'antd';

/**
 * * Component: Ingredients button for suggestion - component position switch after select
 * @buttonText ingredients name
 */
const SelectButton = (props) => {
  const { buttonText, onClick } = props;
  return (
    <Button type={'secondary'} size="small" onClick={onClick}>
      {buttonText}
    </Button>
  );
};

export default SelectButton;
