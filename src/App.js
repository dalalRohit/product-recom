import React, { Component } from 'react';
import styled from 'styled-components';
import {Link,Route} from 'react-router-dom';
import Main from './containers/Main/Main';
import Header from './containers/Header/Header';
import About from './containers/About/About';


const Layout=styled.div`
  width:100%;
  height:100%;
  min-height:100%;
  max-width:100%;
  box-sizing:border-box;
`;
const Footer=styled.div`
  width:100%;
  background-color:var(--main-navbar-color);
  color:white;
  min-height:6vh;
  max-width:100%;
  box-sizing:border-box;
  padding:.7em;
  text-align:center;
`
class App extends Component {
  render() {
    return (
        <Layout>
            <Header />
            <Main />
        </Layout>
    );
  }
}


export default App;