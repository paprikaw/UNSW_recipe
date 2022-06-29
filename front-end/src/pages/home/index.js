/* The login page start up code is from: https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/sign-in/SignIn.js */
import Category from "@/components/category";
import { Layout, Spin, Typography } from "antd";
import { React, useEffect, useState } from "react";
import "./index.scss";
import LogoutButton from '@/components/LogoutButton';

const { Title } = Typography;
const { Header, Sider, Content } = Layout;

const Home = () => {
  const [ingredients, setIngredients] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetch("http://localhost:8080/", {
      method: "GET",
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

  return (
    <Layout>
      <Header className="home-nav-bar" style={{ zIndex: 2 }}>
        Header
        <LogoutButton />
      </Header>
      <Layout hasSider>
        <Sider
          width={350}
          theme="light"
          style={{
            overflow: "auto",
            height: "100vh",
            position: "fixed",
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
  );
};

/* Handler function */
export default Home;
