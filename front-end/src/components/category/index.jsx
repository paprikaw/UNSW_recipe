import React, { useState, useEffect } from 'react';
import { Select, Typography } from 'antd';
import CollapseBox from './collapseBox';
import './index.scss';
import SuggestionBox from './suggestionBox';

const { Title } = Typography;
const { OptGroup } = Select;
const ingredientIniState = {};
const suggestionIngredientIniState = {};

/**
 * Component for contributor page
 *
 * @component
 * @example
 * const ingredients = ['apple', 'pear']
 * const ingredientData = {a: ["apple", "apple2"]}
 * const suggustionIngredientData = ["apple", "pear"]
 * const onChange = categoryList(selectedIngredients) => void
 */
const Category = React.memo(
  ({ ingredientData = {}, suggustionIngredientData = [], onChange }) => {
    const { Option } = Select;

    const [optionState, setOptionState] = useState({});
    const [suggestionOptionState, setSuggestionOptionState] = useState({});
    const [runningListState, setRunningListState] = useState([]);
    // Setting up initial state
    useEffect(() => {
      // Process data from input
      const children = [];
      for (const key in ingredientData) {
        ingredientData[key].map((value) =>
          children.push(<Option key={value}>{value}</Option>)
        );
        ingredientData[key].map((value) => (ingredientIniState[value] = false));
      }
      suggustionIngredientData.map(
        (value) => (suggestionIngredientIniState[value] = true)
      );

      setOptionState(ingredientIniState);
      setSuggestionOptionState(suggestionIngredientIniState);
    }, [ingredientData, suggustionIngredientData]);

    useEffect(() => {
      const list = Object.entries(optionState)
        .filter(([_key, value]) => value)
        .map(([key, _value]) => key);
      setRunningListState(list);
      onChange(list);
    }, [optionState]);

    const handleSuggestionIngre = (key) => {
      setSuggestionOptionState({ ...suggestionOptionState, [key]: false });
      setOptionState({ ...optionState, [key]: true });
    };

    const handleOnSelectChange = (value) => {
      setRunningListState(value);

      const newState = { ...ingredientIniState };
      value.map((key) => (newState[key] = true));
      setOptionState(newState);

      const newSugState = { ...suggestionIngredientIniState };
      value.map((key) => newSugState[key] && (newSugState[key] = false));
      setSuggestionOptionState(newSugState);
    };

    // Handle when ingredient box has changed
    const handleOnRegBoxClick = (buttonText) => {
      if (optionState[buttonText]) {
        setOptionState({ ...optionState, [buttonText]: false });
      } else {
        setOptionState({ ...optionState, [buttonText]: true });
      }

      if (Object.keys(suggestionOptionState).includes(buttonText)) {
        if (optionState[buttonText]) {
          setSuggestionOptionState({
            ...suggestionOptionState,
            [buttonText]: true,
          });
        } else {
          setSuggestionOptionState({
            ...suggestionOptionState,
            [buttonText]: false,
          });
        }
      }
    };

    return (
      <div className="main-component">
        <Select
          mode="multiple"
          allowClear
          style={{ width: '100%' }}
          placeholder="Please select"
          onChange={handleOnSelectChange}
          value={runningListState}
          className="mySelect"
          onDropdownVisibleChange={(open) =>
            open
              ? (document.getElementById('sider').style.overflow = 'hidden')
              : (document.getElementById('sider').style.overflow = 'auto')
          }
        >
          {Object.entries(ingredientData)
            .sort((a, b) => a[0] > b[0])
            .map(([_key, values]) => (
              <OptGroup label={_key}>
                {values.map((value) => (
                  <Option value={value}>{value}</Option>
                ))}
              </OptGroup>
            ))}
        </Select>
        <br />
        <br />
        <div className="collapseBox">
          <div key={'suggest'}>
            <SuggestionBox
              data={suggestionOptionState}
              title={<Title level={5}>You might have these ingredients</Title>}
              onClick={handleSuggestionIngre}
            />
            <br />
          </div>
          {Object.entries(ingredientData).map(([key, values]) => (
            <div key={key}>
              <CollapseBox
                data={values}
                title={<Title level={5}>{key}</Title>}
                selectState={optionState}
                onClick={handleOnRegBoxClick}
              />
              <br />
            </div>
          ))}
        </div>
      </div>
    );
  }
);

export default Category;
