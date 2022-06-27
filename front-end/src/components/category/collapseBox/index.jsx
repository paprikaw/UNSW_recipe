 import {React, useState} from 'react'
import useCollapse from 'react-collapsed'
import { Card, Button, Spin, Space } from 'antd'
import SelectButton from './selectButton'


function CollapseBox (props) {
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse({});
  const newDic = {}
  const {data, title} = props;

  data.map(name => newDic[name] = false);
  const [stateDic, setStateDic] = useState(newDic);
  return (
    <Card title={title} extra={
            <Button type='primary' {...getToggleProps()} >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
        } 
        style={{ width: 300 }}
        >
      {
        isExpanded ?
        <div style={{height: '300px'}} {...getCollapseProps()}>
        <Space size={[8, 16]} wrap>
          {
            stateDic ?
          data.map(name => {
            return <SelectButton selectState={stateDic} setSelectState={setStateDic} buttonText={name}/>})
            :
          <Spin tip="Loading..."/>
          } 
          </Space>
        </div>
        :
        <Space size={[8, 16]} wrap>
          {
            stateDic ?
          data.slice(0, 6).map(name => {
            return <SelectButton selectState={stateDic} setSelectState={setStateDic} buttonText={name}/>})
            :
          <Spin tip="Loading..."/>
          } 
          </Space>
      }
    </Card>
  )
}

 export default CollapseBox;