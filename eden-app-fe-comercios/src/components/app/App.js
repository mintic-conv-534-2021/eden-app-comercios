//Dependencies
import React from "react";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import { Layout} from 'antd';

//Resources
import './App.css';
import "antd/dist/antd.css";

//Internal Components
import Home from "../home/home";
import AddCategory from "../categories/addCategory";
import Categories from "../categories/categories";
import Organizations from "../organizations/organizations";
import HeaderContent from "../header/header"
import FooterContent from "../footer/footer"

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <div className="App">
      <Router>
        <Layout className="layout">
          <Header>
            <HeaderContent />
          </Header>

          <Content className="main-layout">
            {/* Content part  */}
            <div className="site-layout-content">
              <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/categories/add" component={AddCategory} />
                <Route exact path="/categories" component={Categories} />
                <Route exact path="/organizations" component={Organizations} />
                <Route path="*" component={Error} />
              </Switch>
            </div>
          </Content>

          {/* Footer part  */}
          <Footer>
            <FooterContent />
          </Footer>
        </Layout>
      </Router>
    </div>
  );
}

export default App;
