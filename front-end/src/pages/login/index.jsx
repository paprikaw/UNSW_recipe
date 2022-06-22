
/* The login page start up code is from: https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/sign-in/SignIn.js */
import React from 'react';
import { Button, Checkbox, Form, Input, Avatar, Space} from 'antd';
import { LockTwoTone } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './index.scss';

const Login = () => {
  // const navigate = useNavigate();
  // const context = React.useContext(StoreContext);
  // const setToken = context.token[1];
  // const setAuth = context.auth[1];
  // const setList = context.list[1];
  // const setOwner = context.owner[1];
  // const loginSubmitHandle = (event) => {
  //   event.preventDefault();
  //   const data = new FormData(event.currentTarget);
  //   // eslint-disable-next-line no-console
  //   const body = {
  //     email: data.get('email1'),
  //     password: data.get('password1'),
  //   };
  //   fetchPost('POST', '/user/auth/login', body, null)
  //     .then(fetchToken => {
  //       setToken(fetchToken.token);
  //       console.log(fetchToken);
  //       setAuth(true);
  //       fetchPost('Get', '/listings', null, null)
  //         .then(data => {
  //           console.log(data.listings)
  //           setList(data.listings);
  //         })
  //         .catch(err => {
  //           alert(err);
  //         })
  //       setOwner(body.email);
  //       navigate('/HostedList');
  //     })
  //     .catch(err => {
  //       alert(err);
  //     })
  // }

  return (
    <div>
      <Avatar size={64} icon={<LockTwoTone />} className='loginIcon'/>
      <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 8 }}
      initialValues={{ remember: true }}
      // onFinish={onFinish}
      //onFinishFailed={onFinishFailed}
      autoComplete="off"
  >
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
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
        <Space size='large'>
        <Button type="primary" htmlType="submit" offset='8' >
          login
        </Button>
        <Link to='/register'>
          <Button type="primary">
            Register
          </Button>
        </Link>
        </Space>
      </Form.Item>
    </Form>
    </div>
  );
};

/* Handler function */
export default Login