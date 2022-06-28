 import {React} from 'react'
import useCollapse from 'react-collapsed'
import { Card, Button, Spin, Space } from 'antd'
import SelectButton from './selectButton'


function CollapseBox (props) {
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse({});
  const newDic = {}
  const {data, title, selectState, setSelectState} = props;
  data.map(name => newDic[name] = false);
  return (
    <Card title={title} extra={
            <Button type='primary' {...getToggleProps()} >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
        } 
        style={{ width: 300, margin: '0 auto' }}
        >
      {
        isExpanded ?
        <div style={{height: '300px'}} {...getCollapseProps()}>
        <Space size={[8, 16]} wrap>
          {
            selectState ?
          data.map(name => {
            return <SelectButton selectState={selectState} setSelectState={setSelectState} buttonText={name} categoryKey={title}/>})
            :
          <Spin tip="Loading..."/>
          } 
          </Space>
        </div>
        :
        <Space size={[8, 16]} wrap>
          {
            selectState ?
          data.slice(0, 6).map(name => {
            return <SelectButton selectState={selectState} setSelectState={setSelectState} buttonText={name}/>})
            :
          <Spin tip="Loading..."/>
          } 
          </Space>
      }
    </Card>
  )
}

 export default CollapseBox;