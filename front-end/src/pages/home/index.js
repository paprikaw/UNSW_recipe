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
import {
  UserOutlined,
  SearchOutlined,
  ControlOutlined,
} from '@ant-design/icons';
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

  const [filteredThumbnails, setFilteredThumbnails] = useState([]);
  const [sortedThumbnails, setSortedThumbnails] = useState([]);
  const [displayingThumbails, setDisplayThumbnails] = useState([]);
  const [sortAscending, setSortAscending] = useState(false);
  // page navigate and account info
  const navigate = useNavigate();
  // whether the homepage is showed:
  const [isHomePage, setIsHomePage] = useState(true);
  // Ingredient data state
  const [ingredientData, ingredientDataLoading] = useFetch('/category');
  // Recommended ingredient state
  const [sugIngredientData, sugIngredientDataLoading] = useFetch(
    '/top10',
    (data) => data.ingredients
  );
  const [curThumbnailDetails, setCurThumbnailDetails] = useState({});
  // mealType filter state
  const [mealTypeOptions, setMealTypeOptions] = useState([]);
  const [sortingOption, setSortingOption] = useState([]);

  // Recommended ingredient state
  const [ingreSetData, isIngreSetLoading] = useFetch(
    '/topThreeNoResultIngredientSets',
    (data) => data.results.map((set) => set.ingredientSets)
  );

  // State for prefilled ingredient in the contributor page
  // When ingredient set is clicked
  const [prefillIngredient, setPrefillIngredient] = useState([]);

  const [thumbnails, isFoodTimeLoading, setThumbnails] = useFetch(
    '/topThreeLikedRecipesOnMealType',
    (data) => data.recipes,
    foodOfTimeBody,
    []
  );
  const [originalThumbnail, setOriginalThumbnail] = useState([]);
  // handle the filter case
  useEffect(() => {
    console.log(mealTypeOptions);
    console.log(sortingOption);
    handleFilter(mealTypeOptions);
    handleSorter(sortingOption);
  }, [mealTypeOptions]);

  useEffect(() => {
    console.log(mealTypeOptions);
    console.log(sortingOption);
    handleSorter(sortingOption);
  }, [sortingOption]);

  const handleFilter = (value) => {
    console.log(value);
    console.log(originalThumbnail);
    value.length > 0
      ? setThumbnails(
          originalThumbnail.filter((thumbnail) =>
            thumbnail.mealType.some((_element) => value.includes(_element))
          )
        )
      : originalThumbnail.length > 0 && setThumbnails(originalThumbnail);
  };

  const handleSorter = (value) => {
    // if (value === 'descending') {
    //   setThumbnails((prev) => [
    //     ...prev.sort((a, b) => a.recipeName < b.recipeName),
    //   ]);
    // } else if (value === 'ascending') {
    //   setThumbnails((prev) => [
    //     ...prev.sort((a, b) => a.recipeName >= b.recipeName),
    //   ]);
    // } else {
    //   setThumbnails((prev) => [...prev.sort((a, b) => a.likes < b.likes)]);
    // }
    if (value === 'most_likes') {
      setThumbnails((prev) => [...prev.sort((a, b) => b.likes - a.likes)]);
    } else if (value === 'matched_ingredients') {
      setThumbnails((prev) => [
        ...prev.sort(
          (a, b) => b.numIngredientsMatched - a.numIngredientsMatched
        ),
      ]);
    }
  };
  const onSorterChange = (value) => {
    setSortingOption(value);
  };

  const onFilterChange = (value) => {
    setMealTypeOptions(value);
  };

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
    setOriginalThumbnail(data.recipes);

    // If filter and sorter has already been selected, we filter them out.
    mealTypeOptions && handleFilter(mealTypeOptions);
    sortingOption && handleSorter(sortingOption);
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
                  onChange={onFilterChange}
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

                <>Sort by</>
                <Select
                  defaultValue="matched_ingredients"
                  style={{
                    width: 150,
                  }}
                  onChange={handleSorter}
                >
                  <Option value={'most_likes'}>Most likes</Option>
                  <Option value={'matched_ingredients'}>
                    Matched ingredients
                  </Option>
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
                  These ingredients need you to contribute!{' '}
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
                {thumbnails.map((data) => (
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
