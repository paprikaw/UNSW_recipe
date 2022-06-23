import React from 'react'
import useCollapse from 'react-collapsed'
import { Card, Button } from 'antd'

const ingredientData = {
    'cooker': ['a', 'b', 'c'],
    'ingredients': ['a', 'b', 'c'],
    'apple': ['a', 'b', 'c'],
}

const Category = (props) => {
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse()
  return (
    <Card title={props.title} extra={
            <Button type='primary' {...getToggleProps()} >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
        } 
        style={{ width: 300 }}
        >
      <section {...getCollapseProps()}>Collapsed content 🙈</section>
    </Card>
  )
}

 export default Category