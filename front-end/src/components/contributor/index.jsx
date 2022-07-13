import { Card, Select, InputNumber, Form, Space, Button, Input } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import React from 'react';

const { Option, OptGroup } = Select;
const Contributor = (props) => {
  const { ingredients } = props;
  const onFinish = (values) => {
    console.log('Received values of form:', values);
  };
  return (
    <Card>
      <Form
        name="dynamic_form_nest_item"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.List name="ingredients">
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
                    alignItems: 'baseline',
                  }}
                >
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
                    style={{}}
                    name={[name, 'ingredients']}
                  >
                    <Select>
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
                    style={{}}
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
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Contributor;
