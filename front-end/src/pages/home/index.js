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
  Row,
  Col,
} from 'antd';
import { UserOutlined, AudioOutlined, SearchOutlined } from '@ant-design/icons';
import Contributor from '@/components/contributor';
import { React, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.scss';
import { getRidOfEmoji } from '@/utils/utils';
import Thumbnail from '@/components/thumbnail';

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

const Home = () => {
  const [ingredients, setIngredients] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [isContriModalVisible, setIsContriModalVisible] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);
  const [curThumbnailDetails, setCurThumbnailDetails] = useState({});
  const [isRecipeLoading, setIsRecipeLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const onSearch = (value) => setThumbnails(value);
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

  const onCategoryChange = (list) => {
    setCategoryList(list);
  };

  const handleSearch = async (list) => {
    setIsRecipeLoading(true);
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
    setIsRecipeLoading(false);
    setThumbnails(data.recipes);
  };

  const handleClickThumbnail = (recipeId) => {
    fetch('/details?recipeId=' + recipeId, {
      method: 'GET',
    })
      .then((v) => {
        return v.json();
      })
      .then((data) => {
        setCurThumbnailDetails(data.recipes);
      })
      .catch((e) => console.log(e));
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
            zIndex: 1,
            display: 'flex',
            justifyContent: 'flex-end',
            alignContent: 'center',
            alignItems: 'center',
            position: 'fixed',
            width: '100%',
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
            id="sider"
            width={350}
            theme="light"
            style={{
              overflow: 'auto',
              height: '100vh',
              left: 0,
              bottom: 0,
              paddingTop: '64px',
            }}
          >
            <div className="home-sider-childrens" style={{}}>
              <Title level={2}>Ingredients</Title>
              {isLoading ? (
                <div className="spin">
                  <Spin />
                </div>
              ) : (
                <Category data={ingredients} onChange={onCategoryChange} />
              )}
            </div>
            <Button
              className="my-button"
              type="primary"
              shape="round"
              style={{}}
              onClick={(_event) => handleSearch(categoryList)}
              icon={<SearchOutlined />}
            >
              Search
            </Button>
          </Sider>
          <Content
            style={{
              marginTop: '64px',
              padding: '20px 20px',
              overflow: 'scroll',
            }}
          >
            <Spin spinning={isRecipeLoading}>
              <Row gutter={[10, 20]}>
                {thumbnails.map((data) => (
                  <Col xs={24} sm={24} md={12} lg={8} xl={6}>
                    <Thumbnail
                      recipeId={data.recipeId}
                      recipeName={data.recipeName}
                      mealType={data.mealType}
                      likes={data.likes}
                      cookTime={data.cookTime}
                      thumbnail={'/static/' + data.thumbnail}
                      numIngredientsMatched={data.numIngredientsMatched}
                      onClick={handleClickThumbnail}
                    />
                  </Col>
                ))}
              </Row>
            </Spin>
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
    </>
  );
};

/* Handler function */
export default Home;
