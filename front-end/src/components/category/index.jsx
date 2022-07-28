import { React, useState, useEffect } from 'react';
import { Select, Typography } from 'antd';
import CollapseBox from './collapseBox';
import './index.scss';
import SuggestionBox from './suggestionBox';

const { Title } = Typography;

const Category = (props) => {
  const { Option } = Select;
  const { data, onChange } = props;
  const children = [];
  const iniState = {};

  for (const key in data) {
    data[key].map((value) =>
      children.push(<Option key={value}>{value}</Option>)
    );
    data[key].map((value) => (iniState[value] = false));
  }
  const [opState, setOpState] = useState(iniState);
  const [opStateList, setOpStateList] = useState([]);
  const [sugIngredients, setSugIngredients] = useState({
    '🍰 Baking Powder': true,
    '🍰 Baking Soda': true,
    '🌾 White Flour': true,
  });

  const handleSuggestionIngre = (key) => {
    setSugIngredients({ ...sugIngredients, [key]: false });
    setOpState({ ...opState, [key]: true });
  };

  const handleOnSelectChange = (value) => {
    console.log(value);
    setOpStateList(value);
    const newState = iniState;
    value.map((value) => (newState[value] = true));
    setOpState(newState);

    value.map((value) => {
      if (Object.keys(sugIngredients).includes(value)) {
        setSugIngredients({ ...sugIngredients, [value]: false });
      }
      newState[value] = true;
    });
  };

  const handleOnSelectDeselect = (value) => {
    if (Object.keys(sugIngredients).includes(value)) {
      setSugIngredients((preValue) => {
        const newValue = { ...preValue };
        newValue[value] = true;
        return newValue;
      });
    }
  };

  const handleOnRegBoxClick = (buttonText) => {
    if (opState[buttonText]) {
      setOpState({ ...opState, [buttonText]: false });
    } else {
      setOpState({ ...opState, [buttonText]: true });
    }

    if (Object.keys(sugIngredients).includes(buttonText)) {
      if (opState[buttonText]) {
        setSugIngredients({ ...sugIngredients, [buttonText]: true });
      } else {
        setSugIngredients({ ...sugIngredients, [buttonText]: false });
      }
    }
  };

  useEffect(() => {
    const list = Object.entries(opState)
      .filter(([_key, value]) => value)
      .map(([key, _value]) => key);
    setOpStateList(list);
    onChange(list);
  }, [opState]);

  return (
    <div className="main-component">
      <Select
        mode="multiple"
        allowClear
        style={{ width: '100%' }}
        placeholder="Please select"
        onChange={handleOnSelectChange}
        onDeselect={handleOnSelectDeselect}
        value={opStateList}
        className="mySelect"
        onDropdownVisibleChange={(open) =>
          open
            ? (document.getElementById('sider').style.overflow = 'hidden')
            : (document.getElementById('sider').style.overflow = 'auto')
        }
      >
        {children}
      </Select>
      <br />
      <br />
      <div className="collapseBox">
        <div key={'suggest'}>
          <SuggestionBox
            data={sugIngredients}
            title={<Title level={5}>You might have these ingredients</Title>}
            onClick={handleSuggestionIngre}
          />
          <br />
        </div>
        {Object.entries(data).map(([key, values]) => (
          <div key={key}>
            <CollapseBox
              data={values}
              title={<Title level={5}>{key}</Title>}
              selectState={opState}
              onClick={handleOnRegBoxClick}
            />
            <br />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
