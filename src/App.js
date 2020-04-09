import React, { Component } from 'react';
import styled from 'styled-components';

import Main from './containers/Main/Main';
import Header from './containers/Header/Header';
// Testing
import Cards from './containers/Cards/Cards';
import Spinner from './components/UI/Spinner/Spinner';

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
            {/* <Cards /> */}
            {/* <Spinner /> */}
            {/* <Footer>Footer</Footer> */}
        </Layout>
    );
  }
}


export default App;