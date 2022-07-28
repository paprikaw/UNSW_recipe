import { React } from 'react';
import { Button } from 'antd';

const SelectButton = (props) => {
  const { buttonText, onClick } = props;
  return (
    <Button type={'secondary'} size="small" onClick={onClick}>
      {buttonText}
    </Button>
  );
};

export default SelectButton;
