/* The login page start up code is from: https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/sign-in/SignIn.js */
import React from 'react';
import {
  Button,
  Checkbox,
  Form,
  Input,
  Avatar,
  Space,
  Badge,
  message,
} from 'antd';
import { LockTwoTone } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import './index.scss';
import bcrypt from 'bcryptjs';

const Register = () => {
  const navigate = useNavigate();

  function handleOnFinsh(values) {
    const hashedPassword = bcrypt.hashSync(
      values.password,
      '$2a$10$CwTycUXWue0Thq9StjUM0u'
    );
    fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        email: values.email,
        password: hashedPassword,
        username: values.username,
      }),
    })
      .then((v) => {
        return v.json();
      })
      .then((data) => {
        if (data.msg === 'SIGNUP_SUCCESS') {
          navigate('/');
          message.success('Register successful!');
        } else {
          message.error(data.error + ', please try again');
        }
      });
  }

  return (
    <div>
      <Avatar size={64} icon={<LockTwoTone />} className="loginIcon" />
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 8 }}
        initialValues={{ remember: true }}
        onFinish={handleOnFinsh}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              type: 'email',
              message: 'Email format is not correct',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Username"
          name="username"
          rules={[
            { required: true, message: 'Please input your username!' },
            {
              max: 10,
              min: 3,
              message: 'Username should be in 3 to 10 characters',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: 'Please input your password!' },
            // {
            //   pattern: /^[A-Z]((?![^a-z]+$)(?!\D+$).{5,14}$)$/,
            //   message: 'Length should be 6-15 characters and include at least a Uppercase and lower case letter'
            // }
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('The two passwords that you entered do not match!')
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{ offset: 8, span: 16 }}
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
          <Space size="large">
            <Button type="primary" htmlType="submit" onClick={handleOnFinsh}>
              Register
            </Button>
          </Space>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
          <Link to="/">
            <Badge dot>
              <a href="#">Already have an account? Login</a>
            </Badge>
          </Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
