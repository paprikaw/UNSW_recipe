import React from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox, Form, Input, Avatar, Space, Badge} from 'antd';
import { LockTwoTone } from '@ant-design/icons';
import './index.scss';

function RegisterForm ({ submit }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');

  const onSubmit = () => {
    submit(email, password, name);
  }

  return (<>
    <div>
    <Avatar size={64} icon={<LockTwoTone />} className='loginIcon'/>
      <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 8 }}
      initialValues={{ remember: true }}
      onFinish={handleOnFinsh}
      // onFinishFailed={onFinishFailed}
      autoComplete="off"
      >

      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>

			<Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>

			<Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>

			<Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
        <Checkbox>Remember me</Checkbox>
        <Link to='/'>
          <Badge dot>
            <a href="#">Already have an account? Login</a>
          </Badge>
        </Link>
      </Form.Item>

			<Form.Item wrapperCol={{ offset: 8, span: 8 }} >
        <Space size='large' >
        <Button type="primary" htmlType='submit'>
          Register
        </Button>
        </Space>
      </Form.Item>
      </Form>
    </div>
  </>)
}

RegisterForm.propTypes = {
  submit: PropTypes.func
}

export default RegisterForm;