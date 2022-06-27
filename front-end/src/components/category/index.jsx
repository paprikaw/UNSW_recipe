import React from 'react'
import { Divider, Select} from 'antd'
import CollapseBox from './collapseBox'

      // <Select
      //   mode="multiple"
      //   allowClear
      //   style={{ width: '100%' }}
      //   placeholder="Please select"
      //   defaultValue={['a10', 'c12']}
      // >
      // {children}
      // </Select>

const Category = (props) => {
  const {Option} = Select;
  const {data} = props;
  const children = [];
  for (const key in data) {
    data[key].map(value => children.push(<Option key={value}>{value}</Option>));
  }

  return (
    <>
      {Object.entries(data).map(([key, values]) => (
        <React.Fragment key={key}>
          <CollapseBox title={key} data={values} />
          <Divider/>
        </React.Fragment>
      ))}
     </>
  )
}

 export default Category