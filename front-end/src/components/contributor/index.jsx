import {
  Card,
  Select,
  InputNumber,
  Form,
  Button,
  Input,
  Typography,
  Slider,
  Row,
  Col,
  message,
} from 'antd';

import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { React, useEffect, useState, useRef } from 'react';
import './index.scss';
import UploadPicture from '../upload/UploadPicture';
import { getRidOfEmoji } from '../../utils/utils';
const { Text } = Typography;
const { Option, OptGroup } = Select;
const { TextArea } = Input;

// Transform the format of data to what backend want
function processContributeVal(value) {
  value.steps = value.steps.map((obj) => obj['step']);
  value.token = localStorage.getItem('token');
}

/**
 * Component for contributor page
 *
 * @component
 * @example
 * const ingredients = ['apple', 'pear']
 * return (
 *   <Contributor ingredients={ingredients} />
 * )
 */
const Contributor = (props) => {
  //set value for the slider bar
  const marks = {
    0: '0min',
    200: {
      style: {
        color: '#f50',
      },
      label: <strong>200min</strong>,
    },
  };
  const { ingredients = [], onOk, addedIngredients } = props;
  const [sliderInputValue, setSliderInputValue] = useState(1);
  // Control the ingredient set

  // Control the uploader
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [recipeId, setRecipeId] = useState(-1);
  const [form] = Form.useForm();

  const ref = useRef();
  useEffect(() => {
    ref.current.setFieldValue('ingredients', addedIngredients);
  }, [addedIngredients]);

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const onSliderChange = (newValue) => {
    setSliderInputValue(newValue);
  };

  const onUploadChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }

    if (info.file.status === 'done') {
      // Get this url from response in real world.
      setRecipeId(info.file.response.recipeId);
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const onFormFinish = (values) => {
    // Get rid of emoji in the recipe names
    values.ingredients.map(
      (element) => (element.name = getRidOfEmoji(element.name))
    );
    if (recipeId !== -1) {
      console.log('Contributed:', values);
      values.recipeId = recipeId;
      processContributeVal(values);
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
          data.error && message.warning(data.error);
          data.msg && message.success(data.msg);
          onOk();
          form.resetFields();
          setImageUrl();
        })
        .catch((e) => console.log(e));
    } else {
      message.error('Please upload images!');
    }
  };

  return (
    <Card id="contributor-card">
      <Form
        name="dynamic_form_nest_item"
        onFinish={onFormFinish}
        autoComplete="off"
        form={form}
        ref={ref}
      >
        <br />

        <UploadPicture
          onChange={onUploadChange}
          loading={loading}
          imageUrl={imageUrl}
        />

        <br />
        <br />

        <Form.Item
          name="recipeName"
          label="Recipe name"
          rules={[
            {
              required: true,
              message: 'Input required',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Row>
          <Col span={18}>
            <Form.Item
              name="cookTime"
              label="Cook time"
              rules={[
                {
                  required: true,
                  message: 'Input required',
                },
              ]}
            >
              <Slider
                min={1}
                max={200}
                marks={marks}
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
          rules={[
            {
              required: true,
              message: 'Input required',
            },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="please select"
            size="big"
            bordered={'false'}
            getPopupContainer={() =>
              document.getElementById('contributor-card')
            }
          >
            <Option value={'Breakfast'}>Breakfast</Option>
            <Option value={'Lunch'}>Lunch</Option>
            <Option value={'Dinner'}>Dinner</Option>
            <Option value={'Dessert'}>Dessert</Option>
            <Option value={'Snack'}>Snack</Option>
            <Option value={'Entree'}>Entree</Option>
            <Option value={'Main'}>Main</Option>
            <Option value={'Tea'}>Tea</Option>
          </Select>
        </Form.Item>
        <Card>
          <h2>Add ingredients</h2>
          <Form.List
            name="ingredients"
            rules={[
              {
                validator: async (_, ingredient) => {
                  if (!ingredient || ingredient.length < 2) {
                    return Promise.reject(new Error('At least 2 ingredients'));
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }, { errors }) => (
              <div>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className="row-container">
                    <Form.Item
                      {...restField}
                      name={[name, 'quantity']}
                      rules={[
                        {
                          required: true,
                          message: 'Input required',
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
                      name={[name, 'name']}
                      rules={[
                        {
                          required: true,
                          message: 'Input required',
                        },
                      ]}
                    >
                      <Select
                        placeholder="Ingredients"
                        showSearch
                        getPopupContainer={() =>
                          document.getElementById('contributor-card')
                        }
                      >
                        {Object.entries(ingredients)
                          .sort((a, b) => a[0] > b[0])
                          .map(([_key, values]) => (
                            <OptGroup label={_key}>
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
                          message: 'Input required',
                        },
                      ]}
                      style={{ flexGrow: 1 }}
                    >
                      <Select
                        placeholder={'Unit'}
                        getPopupContainer={() =>
                          document.getElementById('contributor-card')
                        }
                      >
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
                    <div className="head-tail-field1">
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </div>
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
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </div>
            )}
          </Form.List>
        </Card>
        <br />
        <Card>
          <h2>Add instructions</h2>
          <Form.List
            name="steps"
            rules={[
              {
                validator: async (_, instruction) => {
                  if (!instruction) {
                    return Promise.reject(new Error('At least 1 step'));
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }, { errors }) => (
              <div>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className="row-container">
                    <div className="head-tail-field2">
                      <Text>Step {name + 1}</Text>
                    </div>
                    <Form.Item
                      {...restField}
                      name={[name, 'step']}
                      rules={[
                        {
                          required: true,
                          message: 'Please fill in the form',
                        },
                      ]}
                      style={{ flexGrow: 1 }}
                    >
                      <TextArea rows={4} style={{ display: 'inline' }} />
                    </Form.Item>
                    <div className="head-tail-field2">
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </div>
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
                  <Form.ErrorList errors={errors} />
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
