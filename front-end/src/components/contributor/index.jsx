import {
  Card,
  Select,
  InputNumber,
  Form,
  Space,
  Button,
  Input,
  Typography,
  TimePicker,
  Slider,
  Row,
  Col,
} from 'antd';

import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { React, useState } from 'react';
import './index.scss';
import UploadPicture from '../upload/UploadPicture';
const { Text } = Typography;
const { Option, OptGroup } = Select;
const { TextArea } = Input;

function processContributeVal(value) {
  value.instructions = value.instructions.map((obj) => obj['step']);
  value.token = localStorage.getItem('token');
  console.log(value);
}

const Contributor = (props) => {
  const [sliderInputValue, setSliderInputValue] = useState(1);
  const [recipeId, setRecipeId] = useState(-1);
  const onSliderChange = (newValue) => {
    setSliderInputValue(newValue);
  };

  // const response = {
  //   recipeId: rjson2['value'],
  //   recipeName: 'Beef pie',
  //   mealType: 'breakfast',
  //   cookTime: 60,
  //   accountId: user1['data']['accountId'],
  //   ingredients: [
  //     {
  //       name: 'Ground Beef',
  //       quantity: 200,
  //       unit: 'g',
  //     },
  //     {
  //       name: 'White Flour',
  //       quantity: 100,
  //       unit: 'g',
  //     },
  //     {
  //       name: 'Salt',
  //       quantity: 3,
  //       unit: 'g',
  //     },
  //   ],
  // };

  const { ingredients } = props;
  const onFinish = (values) => {
    if (recipeId !== -1) {
      values.recipeId = recipeId;
      processContributeVal(values);
      console.log(values);
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      };

      fetch('/update-recipe-info', requestOptions)
        .then((v) => {
          return v.json();
        })
        .then((data) => {
          console.log(data);
        })
        .catch((e) => console.log(e));
    }
  };
  return (
    <Card>
      <Form
        name="dynamic_form_nest_item"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item required={true}>
          <UploadPicture setRecipeId={setRecipeId} />
        </Form.Item>
        <br />
        <br />

        <Form.Item
          name="recipeName"
          label="Recipe name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Row>
          <Col span={18}>
            <Form.Item
              name="cookTime"
              label="Cook time"
              rules={[{ required: true }]}
            >
              <Slider
                min={1}
                max={200}
                onChange={onSliderChange}
                value={
                  typeof sliderInputValue === 'number' ? sliderInputValue : 0
                }
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="mealType"
          label="Meal type"
          rules={[{ required: true }]}
        >
          <Select placeholder="please select" size="big" bordered={'false'}>
            <Option value={'breakfast'}>Breakfast</Option>
            <Option value={'lunch'}>Lunch</Option>
            <Option value={'dinner'}>Dinner</Option>
            <Option value={'supper'}>Lunch</Option>
            <Option value={'dessert'}>Dessert</Option>
            <Option value={'snack'}>Snack</Option>
            <Option value={'entry'}>Entry</Option>
            <Option value={'main'}>Main</Option>
            <Option value={'tea'}>Tea</Option>
          </Select>
        </Form.Item>
        <Card>
          <h2>Add ingredients</h2>
          <Form.List name="ingredients">
            {(fields, { add, remove }) => (
              <div>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className="row-container">
                    <Form.Item
                      {...restField}
                      name={[name, 'quantity']}
                      rules={[
                        {
                          required: true,
                          message: 'Missing ingredient quantity',
                        },
                      ]}
                    >
                      <InputNumber
                        min={1}
                        max={100}
                        placeholder="Number"
                        step={1}
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      style={{ flexGrow: 2 }}
                      name={[name, 'ingredients']}
                    >
                      <Select placeholder="Ingredients">
                        {Object.entries(ingredients)
                          .sort((a, b) => a[0] > b[0])
                          .map(([key, values]) => (
                            <OptGroup label={key}>
                              {values.map((value) => (
                                <Option value={value}>{value}</Option>
                              ))}
                            </OptGroup>
                          ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'unit']}
                      rules={[
                        {
                          required: true,
                          message: 'Missing last name',
                        },
                      ]}
                      style={{ flexGrow: 1 }}
                    >
                      <Select placeholder="Unit">
                        <Option key={1} value={'cups'}>
                          {'cups'}
                        </Option>
                        <Option key={2} value={'teaspoons'}>
                          {'teaspoons'}
                        </Option>
                        <Option key={3} value={'tablespoons'}>
                          {'tablespoons'}
                        </Option>
                        <Option key={4} value={'pints'}>
                          {'pints'}
                        </Option>
                        <Option key={5} value={'quarts'}>
                          {'quarts'}
                        </Option>
                        <Option key={6} value={'ml'}>
                          {'ml'}
                        </Option>
                        <Option key={7} value={'l'}>
                          {'l'}
                        </Option>
                        <Option key={8} value={'gram'}>
                          {'gram'}
                        </Option>
                        <Option key={9} value={'kilogram'}>
                          {'kilogram'}
                        </Option>
                      </Select>
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </div>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add ingredients
                  </Button>
                </Form.Item>
              </div>
            )}
          </Form.List>
        </Card>
        <br />
        <Card>
          <h2>Add instructions</h2>
          <Form.List name="instructions">
            {(fields, { add, remove }) => (
              <div>
                {fields.map(({ key, name, ...restField }) => (
                  <div
                    key={key}
                    style={{
                      display: 'flex',
                      columnGap: '20px',
                      justifyContent: 'center',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                    }}
                    className="row-container"
                  >
                    <Text>Step {key + 1}</Text>
                    <Form.Item
                      {...restField}
                      name={[name, 'step']}
                      rules={[
                        {
                          required: true,
                          message: 'Step needs',
                        },
                      ]}
                      style={{ flexGrow: 1 }}
                    >
                      <TextArea rows={4} style={{ display: 'inline' }} />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </div>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add instructions
                  </Button>
                </Form.Item>
              </div>
            )}
          </Form.List>
        </Card>
        <br />
        <Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Contributor;
