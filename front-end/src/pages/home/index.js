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
  Drawer,
  Row,
  Col,
  Select,
} from 'antd';
import { UserOutlined, SearchOutlined } from '@ant-design/icons';
import Contributor from '@/components/contributor';
import { React, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.scss';
import { getRidOfEmoji, filterMatch, sortMatch } from '@/utils/utils';
import Recipe from '@/components/recipe';
import Thumbnail from '@/components/thumbnail';
import { useFetch } from '@/utils/useFetch';
import { recipe } from '@/components/recipe/recipe.stories';
import { element } from 'prop-types';
import FoodOfTime from '../foodOfTime';
import IngredientSet from '@/components/contributor/ingredientSet';

import { curMealType } from '@/utils/utils';
const { Title } = Typography;
const { Header, Sider, Content } = Layout;
const { Option, OptGroup } = Select;

const Home = () => {
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [isContriModalVisible, setIsContriModalVisible] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  // right hand, thumbnail & recipe detail page set up
  const [visible, setVisible] = useState(false);
  const [isDrawerLoading, setIsDrawerLoading] = useState(false);

  const [isRecipeLoading, setIsRecipeLoading] = useState(false);

  const foodOfTimeBody = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mealTypes: curMealType() }),
  };

  const [thumbnails, isFoodTimeLoading, setThumbnails] = useFetch(
    '/topThreeLikedRecipesOnMealType',
    (data) => data.recipes,
    foodOfTimeBody,
    []
  );

  const [filteredThumbnails, setFilteredThumbnails] = useState([]);
  const [sortedThumbnails, setSortedThumbnails] = useState([]);
  const [displayingThumbails, setDisplayThumbnails] = useState([]);
  const [sortAscending, setSortAscending] = useState(false);
  //
  const [curThumbnailDetails, setCurThumbnailDetails] = useState({});

  // page navigate and account info
  const navigate = useNavigate();

  // whether the homepage is showed:
  const [isHomePage, setIsHomePage] = useState(true);

  const [ingredientData, ingredientDataLoading] = useFetch('/category');

  const [sugIngredientData, sugIngredientDataLoading] = useFetch(
    '/top10',
    (data) => data.ingredients
  );

  // State management for recommended ingredient sets
  const [ingreSetData, isIngreSetLoading] = useFetch(
    '/topThreeNoResultIngredientSets',
    (data) => data.results.map((set) => set.ingredientSets)
  );
  const [prefillIngredient, setPrefillIngredient] = useState([]);

  const handleContirbuteOk = () => {
    setIsContriModalVisible(false);
  };
  // recipe detail funcs
  const onCategoryChange = useCallback((list) => {
    setCategoryList(list);
  }, []);

  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  const onIngreSetClick = (value) => {
    const newValue = value.map((ingredient) => {
      return { name: ingredient };
    });
    setIsContriModalVisible(true);
    setPrefillIngredient(newValue);
  };

  const onLikeChange = (likes) => {
    setThumbnails((prevState) => {
      prevState[
        thumbnails.findIndex(
          (ele) => ele.recipeId === curThumbnailDetails.recipeId
        )
      ].likes = likes;
      console.log(prevState);
      return [...prevState];
    });
  };
  const handleSearch = async (list) => {
    setIsRecipeLoading(true);
    setIsHomePage(false);
    const response = await fetch('/search', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        ingredients: list.map((name) => getRidOfEmoji(name)),
        token: localStorage.getItem('token'),
      }),
    });
    const data = await response.json();
    console.log(data);
    setIsRecipeLoading(false);

    setThumbnails(data.recipes);
    let display = thumbnails;
    if (!sortAscending && display) {
      display = sortMatch(display, 'Ascending');
    } else {
      display = sortMatch(display, 'Descending');
    }
    // setFilteredThumbnails(data.recipes);
    // setSortedThumbnails(data.recipes);
    setDisplayThumbnails(display);
  };

  const handleSelectFilterSorter = (value) => {
    let display = displayingThumbails;

    if (Array.isArray(value)) {
      // do the filter display first
      console.log('filter type selected ->', value);
      if (value.length === 0) {
        display = thumbnails;
        console.log('filter_OFF -> result:', display);
      } else {
        display = filterMatch(displayingThumbails, value);
      }
      // check sort method after
      if (sortAscending && display) {
        display = sortMatch(display, 'Ascending');
      } else {
        display = sortMatch(display, 'Descending');
      }
    } else {
      if (value !== 'Ascending') {
        setSortAscending(true);
        console.log('Now display Descending');
      } else {
        setSortAscending(false);
        console.log('Now display Ascending');
      }
      if (sortAscending && display) {
        display = sortMatch(display, 'Ascending');
      } else {
        display = sortMatch(display, 'Descending');
      }
    }
    setDisplayThumbnails(display);
    console.log('Final filter -> result:', display);
  };
  const handleClickThumbnail = (recipeId) => {
    setIsDrawerLoading(true);
    showDrawer();
    fetch('/details', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        token: localStorage.getItem('token'),
        recipeId: recipeId,
      }),
    })
      .then((v) => {
        return v.json();
      })
      .then((data) => {
        setCurThumbnailDetails(data.recipe);
        setIsDrawerLoading(false);
        console.log('Recipe detail data -> ', data.recipe);
      })
      .catch((e) => console.log(e));
  };

  const handleLogout = async () => {
    const response = await fetch('/logout', {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        token: localStorage.getItem('token'),
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
              {sugIngredientDataLoading || ingredientDataLoading ? (
                <Spin />
              ) : (
                <Category
                  ingredientData={ingredientData}
                  suggustionIngredientData={sugIngredientData}
                  onChange={onCategoryChange}
                />
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
              height: '90vh',
            }}
          >
            {isHomePage || (
              <div>
                <>Filtered by: </>
                <Select
                  placeholder="All Types"
                  mode="multiple"
                  style={{
                    width: 200,
                  }}
                  onChange={handleSelectFilterSorter}
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

                <>Sorted likes by</>
                <Select
                  defaultValue="Descending"
                  style={{
                    width: 150,
                  }}
                  onChange={handleSelectFilterSorter}
                >
                  <Option value={'Descending'}>Descending</Option>
                  <Option value={'Ascending'}>Ascending</Option>
                </Select>
              </div>
            )}
            <br />
            {isHomePage ? (
              <>
                <FoodOfTime
                  onClick={handleClickThumbnail}
                  top3Recipe={thumbnails}
                  top3RecipeLoading={isFoodTimeLoading}
                />

                <Title level={3}>
                  These ingredients needs you to contribute!{' '}
                </Title>
                <IngredientSet
                  onClick={onIngreSetClick}
                  ingredientSets={ingreSetData}
                  isLoading={isIngreSetLoading}
                />
              </>
            ) : isRecipeLoading ? (
              <Spin />
            ) : (
              <Row gutter={[10, 20]}>
                {displayingThumbails.map((data) => (
                  <Col xs={24} sm={24} md={12} lg={8} xl={6}>
                    <Thumbnail
                      recipeId={data.recipeId}
                      recipeName={data.recipeName}
                      mealType={data.mealType.join(', ')}
                      likes={data.likes}
                      cookTime={data.cookTime}
                      thumbnail={'/static/' + data.thumbnail}
                      numIngredientsMatched={data.numIngredientsMatched}
                      onClick={handleClickThumbnail}
                    />
                  </Col>
                ))}
              </Row>
            )}
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
          <Contributor
            ingredients={ingredientData}
            onOk={handleContirbuteOk}
            addedIngredients={prefillIngredient}
          />
        </div>
      </Modal>
      <Drawer
        placement="right"
        width={400}
        closable={false}
        onClose={onClose}
        visible={visible}
      >
        {isDrawerLoading ? (
          <Spin />
        ) : (
          <Recipe
            username={curThumbnailDetails.username}
            recipeId={curThumbnailDetails.recipeId}
            recipeName={curThumbnailDetails.recipeName}
            mealType={curThumbnailDetails.mealType}
            likes={curThumbnailDetails.likes}
            cookTime={curThumbnailDetails.cookTime}
            thumbnailPath={curThumbnailDetails.thumbnailPath}
            ingredients={curThumbnailDetails.ingredients}
            steps={curThumbnailDetails.steps}
            liked={curThumbnailDetails.liked}
            onLikeChange={onLikeChange}
          />
        )}
      </Drawer>
    </>
  );
};

/* Handler function */
export default Home;
