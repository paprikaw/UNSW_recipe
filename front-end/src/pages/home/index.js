/* The login page start up code is from: https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/sign-in/SignIn.js */
import Category from '@/components/category';
import {
  Layout,
  Spin,
  Typography,
  Button,
  message,
  Modal,
  Avatar,
  Dropdown,
  Menu,
  Input,
  Drawer,
} from 'antd';
import { UserOutlined, AudioOutlined } from '@ant-design/icons';
import Contributor from '@/components/contributor';
import { React, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.scss';
import { getRidOfEmoji } from '@/utils/utils';
import Recipe from '@/components/recipe';

const { Title } = Typography;
const { Header, Sider, Content } = Layout;
const suffix = (
  <AudioOutlined
    style={{
      fontSize: 16,
      color: '#1890ff',
    }}
  />
);

const onSearch = (value) => console.log(value);

const Home = () => {
  // left hand, ingredients menu set up
  const [ingredients, setIngredients] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [isContriModalVisible, setIsContriModalVisible] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  // right hand, recipe detail page set up
  const [visible, setVisible] = useState(false);
  const [childrenDrawer, setChildrenDrawer] = useState(false);
  // page navigate and account info
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleContirbuteOk = () => {
    setIsContriModalVisible(false);
  };

  useEffect(() => {
    fetch('/category', {
      method: 'GET',
    })
      .then((v) => {
        return v.json();
      })
      .then((data) => {
        setIngredients(data);
        setIsLoading(false);
      })
      .catch((e) => console.log(e));
  }, []);

  //navigate to contribute page
  // const handleContribute = () => {
  //   navigate('/contribute');
  // }

  // recipe detail funcs
  const onCategoryChange = (list) => {
    setCategoryList(list);
  };
  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };
  const showChildrenDrawer = () => {
    setChildrenDrawer(true);
  };
  const onChildrenDrawerClose = () => {
    setChildrenDrawer(false);
  };
  // a func of call recipe_detail route when click tiles  needed.
  const onCheckRecipeDetail = () => {};

  const handleSearch = async (list) => {
    const response = await fetch('/search', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        ingredients: list.map((name) => getRidOfEmoji(name)),
      }),
    });
    const data = await response.json();
    console.log(data);
  };

  const handleLogout = async () => {
    const response = await fetch('/logout', {
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

  //menu of the dropdown list of profile
  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: (
            // <Link to={'../'}>Log out</Link>
            <Button
              style={{ zIndex: 2 }}
              onClick={() => setIsLogoutModalVisible(true)}
            >
              Logout
            </Button>
          ),
        },
      ]}
    />
  );

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
          }}
        >
          <Button
            style={{ zIndex: 2, margin: 20 }}
            onClick={() => setIsContriModalVisible(true)}
          >
            Contribute
          </Button>
          <Dropdown overlay={menu} placement="bottom" arrow>
            <Avatar size="large" icon={<UserOutlined />} />
          </Dropdown>
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
                <Category data={ingredients} onChange={onCategoryChange} />
              )}
              <Button
                type="primary"
                shape="round"
                onClick={(_event) => handleSearch(categoryList)}
              >
                Search
              </Button>
            </div>
          </Sider>
          <Content
            style={{
              marginLeft: 300,
            }}
          >
            <Button type="primary" onClick={showDrawer}>
              Recipe tiles Button
            </Button>
          </Content>
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
        title="Contribute my recipe"
        visible={isContriModalVisible}
        onCancel={() => setIsContriModalVisible(false)}
        footer={null}
        transitionName=""
        width={800}
      >
        <div>
          <Contributor ingredients={ingredients} onOk={handleContirbuteOk} />
        </div>
      </Modal>
      <Drawer
        title="Recipe detail page"
        width={520}
        closable={false}
        onClose={onClose}
        visible={visible}
      >
        <div>
          <Recipe />
        </div>
        <Button type="primary" onClick={showChildrenDrawer}>
          Go for detail instructions →
        </Button>
        <Drawer
          title="Recipe detail instruction"
          width={320}
          closable={false}
          onClose={onChildrenDrawerClose}
          visible={childrenDrawer}
        >
          The instructions are as follow...
        </Drawer>
      </Drawer>
    </>
  );
};

/* Handler function */
export default Home;
