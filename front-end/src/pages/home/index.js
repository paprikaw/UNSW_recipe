/* The login page start up code is from: https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/sign-in/SignIn.js */
import Category from '@/components/category';
import { Layout, Spin } from 'antd';
import { React, useEffect, useState } from 'react';
import { Typography } from 'antd';
import './index.scss'
const { Title } = Typography;
const { Header, Sider, Content } = Layout;
const data = {
    'cooker': ['a', 'b', 'c', "Banana", "Apple", ],
    'ingredients': ['e', 'w', 'f'],
    'apple': ['3', '2', '1'],
    'lol': ['12312312312', 'sdadsf', 'adsfasdfsda'],
    'dasfads': ['12312312', 'laksjdfas', 'asldkfjas'],
    'dd': ['asdf;sdlf', '21321421', 'asldgha'],
}


const Home = () => {

const [ingredients, setIngredients] = useState({});
useEffect(() => {
    fetch('http://localhost:8080/', {
      method: 'GET',
    }).then(v => {
      return v.json()
    }).then(data => {
      setIngredients(data);
      console.log(data);
    }).catch(e => console.log(e));
}, []);

  return (
    <Layout>
      <Header className='home-nav-bar'>Header</Header>
      <Layout hasSider>
        <Sider 
        width={300} 
        theme="light" 
        style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 64,
            bottom: 0,
          }}>
          <div className='home-sider-childrens'>
            <Title>Ingredients</Title>
            {
              ingredients?
              <Category data={ingredients}/>
              :
              <Spin/>
            }
          </div>
        </Sider>
        <Content style={{
          marginLeft: 300
        }}>
          content
        </Content>
      </Layout>
    </Layout>
  );
};

/* Handler function */
export default Home