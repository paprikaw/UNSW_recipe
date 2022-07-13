/* The login page start up code is from: https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/sign-in/SignIn.js */
import Category from '@/components/category';
import { Layout, Spin, Typography, Button, message, Modal } from 'antd';
import { React, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.scss';

const { Title } = Typography;
const { Header, Sider, Content } = Layout;

const Home = () => {
  const [ingredients, setIngredients] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [isContriModalVisible, setIsContriModalVisible] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://localhost:8080/', {
      method: 'GET',
    })
      .then((v) => {
        return v.json();
      })
      .then((data) => {
        setIngredients(data);
        setIsLoading(false);
        console.log(data);
      })
      .catch((e) => console.log(e));
  }, []);

  const handleLogout = async () => {
    const response = await fetch('http://localhost:8080/logout', {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        token: token,
      }),
    });

    const data = await response.json();
    if (data.msg === 'LOGOUT_FAILURE') {
      message.error(response.status + ': ' + data.error);
      setIsLogoutModalVisible(false);
    } else {
      message.success('Logout successful!');
      localStorage.removeItem('token');
      setIsLogoutModalVisible(false);
      navigate('/');
    }
  };

  return (
    <>
      <Layout>
        <Header
          className="home-nav-bar"
          style={{
            zIndex: 2,
            display: 'flex',
            justifyContent: 'flex-end',
            alignContent: 'center',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <Button
            style={{ zIndex: 2 }}
            onClick={() => setIsLogoutModalVisible(true)}
          >
            logout
          </Button>
          <Button
            style={{ zIndex: 2 }}
            onClick={() => setIsContriModalVisible(true)}
          >
            contribute
          </Button>
          {/* <Abutton /> */}
        </Header>
        <Layout hasSider>
          <Sider
            width={350}
            theme="light"
            style={{
              overflow: 'auto',
              height: '100vh',
              position: 'fixed',
              left: 0,
              paddingTop: 64,
              bottom: 0,
              zIndex: 1,
            }}
          >
            <div className="home-sider-childrens">
              <Title level={2}>Ingredients</Title>
              {isLoading ? (
                <div className="spin">
                  <Spin />
                </div>
              ) : (
                <Category data={ingredients} />
              )}
            </div>
          </Sider>
          <Content
            style={{
              marginLeft: 300,
            }}
          ></Content>
        </Layout>
      </Layout>
      <Modal
        title="Logout"
        visible={isLogoutModalVisible}
        onOk={handleLogout}
        onCancel={() => setIsLogoutModalVisible(false)}
      >
        <p>Are you sure to logout?</p>
      </Modal>
      <Modal
        title="Contribute Recipe!"
        visible={isContriModalVisible}
        onCancel={() => setIsContriModalVisible(false)}
      >
        <p>Are you sure to logout?</p>
      </Modal>
    </>
  );
};

/* Handler function */
export default Home;
