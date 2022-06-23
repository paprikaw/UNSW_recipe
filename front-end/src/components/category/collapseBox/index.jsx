 import {React, useState} from 'react'
import useCollapse from 'react-collapsed'
import { Card, Button, Spin, Space } from 'antd'
import SelectButton from './selectButton'

const ingredientData = {
    'cooker': ['bahhhhhhhhnana', 'apple', 'aault', 'happy'  ,'vault', 'cault', 'dault', 'eault', 'fault', 'xault', 'zault', 'cault', 'vault', ],
    'ingredients': ['a', 'b', 'c'],
    'apple': ['a', 'b', 'c'],
}

const CollapseBox = (props) => {
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse({});
  const newDic = {}
  ingredientData.cooker.map(name => newDic[name] = false)
  const [stateDic, setStateDic] = useState(newDic);
  return (
    <Card title={props.title} extra={
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
          ingredientData.cooker.map(name => {
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
          ingredientData.cooker.slice(0, 6).map(name => {
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