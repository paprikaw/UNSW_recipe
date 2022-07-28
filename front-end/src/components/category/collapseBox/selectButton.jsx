import { React } from 'react';
import { Button } from 'antd';

const SelectButton = (props) => {
  const { selectState, buttonText, onClick } = props;
  return (
    <Button
      type={selectState[buttonText] ? 'primary' : 'secondary'}
      size="small"
      onClick={onClick}
    >
      {buttonText}
    </Button>
  );
};

export default SelectButton;
