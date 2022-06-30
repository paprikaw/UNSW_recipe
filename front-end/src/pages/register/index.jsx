/* The login page start up code is from: https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/sign-in/SignIn.js */
import React from "react";
import { Button, Checkbox, Form, Input, Avatar, Space, Badge, Alert } from "antd";
import { LockTwoTone } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import "./index.scss";
import bcrypt from 'bcryptjs'

const Register = () => {
  const navigate = useNavigate();

  function handleOnFinsh(values) {
    console.log("here");
    const hashedPassword = bcrypt.hashSync(values.password, '$2a$10$CwTycUXWue0Thq9StjUM0u');
    fetch("http://localhost:8080/signup", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
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
        console.log(data);
        if (data.msg === 'SIGNUP_SUCCESS') {
          console.log(data.msg);
          navigate('/');
        } else {
          // alert('something is wrong(email already used/username not valid...)');
          alert('Registeration failed: ' + data.error);
        }
      });
    console.log("here2");
    // const data =  response.json();
    // console.log(data);
    // navigate('/');
    // console.log(data);
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
        // onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        {/* <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{ offset: 8, span: 16 }}
        >
          <Checkbox>Remember me</Checkbox>
          <Link to="/">
            <Badge dot>
              <a href="#">Already have an account? Login</a>
            </Badge>
          </Link>
        </Form.Item> */}

      <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 8 }} >
        <Space size='large' >
        <Button type="primary" htmlType='submit' onClick={handleOnFinsh}>
          Register
        </Button>
        </Space>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 8 }}><Link to='/'>
          <Badge dot>
            <a href="#">Already have an account? Login</a>
          </Badge>
        </Link></Form.Item>
    </Form>
    </div>
  );
};

/* Handler function */
export default Register;
