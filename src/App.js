import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

import Routerlink from './router.jsx';

import Index from './page/index.jsx';
import Load from './page/load.jsx';
import Regeter from './page/regester.jsx';

import { Row, Col } from 'antd';
import 'antd/dist/antd.css';

class App extends React.Component{
  render(){
      return (
          <Row>
              <Col span={16} offset={4}>
                  <HashRouter>
                      <Routerlink/>
                      <Switch>
                          <Route exact path="/" component={Index}></Route>
                          <Route exact path="/load" component={Load}></Route>
                          <Route exact path="/regeter" component={Regeter}></Route>
                      </Switch>
                  </HashRouter>
              </Col>
          </Row>
      );
  };
}

export default App;
