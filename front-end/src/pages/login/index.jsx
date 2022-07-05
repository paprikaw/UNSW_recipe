
/* The login page start up code is from: https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/sign-in/SignIn.js */
import React from 'react';
import { Button, Checkbox, Form, Input, Avatar, Space, Badge, message} from 'antd';
import { LockTwoTone } from '@ant-design/icons';
import './index.scss';
import { Link,useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs'

const Login = () => {
  const navigate = useNavigate();
  
  async function handleOnFinsh (values) {

    const hashedPassword = bcrypt.hashSync(values.password, '$2a$10$CwTycUXWue0Thq9StjUM0u');
    const response = await fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        email: values.email,
        password: hashedPassword,
      })
    });
    const data = await response.json();
    console.log(data);
    console.log(data.data.token);
    localStorage.setItem('token', data.data.token);
    if (data.msg === 'LOGIN_FAILURE') {
      message.error('Login failed:' + data.error);
    } else {
      navigate('/home');
    }
  }

  return (
    <div>
      <Avatar size={64} icon={<LockTwoTone />} className='loginIcon'/>
      <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 8 }}
      initialValues={{ remember: true }}
      onFinish={handleOnFinsh}
      //onFinishFailed={onFinishFailed}
      autoComplete="off"
  >
      <Form.Item
        label="Email"
        name="email"
        // rules={[{ required: true, message: 'Please input your username!' }]}
        rules={[{required: true, type: 'email', message: 'Email format is not correct'  }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          { required: true, message: "Please input your password!" },
          // {
          //   pattern: /^[A-Z]((?![^a-z]+$)(?!\D+$).{5,14}$)$/,
          //   message: 'Length should be 6-15 characters and include at least a Uppercase and lowercer case letter'
          // }
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
        {/* <Space size='large'> */}
        <Button type="primary" htmlType="submit" offset='8' >
          login
        </Button>
        {/* <Link to='/register'>
          <Button type="primary">
            Register
          </Button>
        </Link> */}
        {/* </Space> */}
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 8 }}><Link to='/register'>
          <Badge dot>
            <a href="#">Don't have an account? Register</a>
          </Badge>
        </Link></Form.Item>
    </Form>
    </div>
  );
};

/* Handler function */
export default Login