import { React, useState, useEffect } from 'react';
import { Select, Typography } from 'antd';
import CollapseBox from './collapseBox';
import './index.scss';

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
  console.log(data);
  const [opState, setOpState] = useState(iniState);
  const [opStateList, setOpStateList] = useState([]);

  const handleOnChange = (value) => {
    setOpStateList(value);
    const newState = iniState;
    value.map((value) => (newState[value] = true));
    setOpState(newState);
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
        onChange={handleOnChange}
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
        {Object.entries(data).map(([key, values]) => (
          <div key={key}>
            <CollapseBox
              data={values}
              title={<Title level={5}>{key}</Title>}
              selectState={opState}
              setSelectState={setOpState}
            />
            <br />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
