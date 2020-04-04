import React, { Component } from 'react';
import styled from 'styled-components';

import Main from './containers/Main/Main';
import Header from './containers/Header/Header';
// Testing
import Cards from './containers/Cards/Cards';

const Layout=styled.div`
    width:100%;
    height:100%;
    max-width:100%;
    margin:0;
    padding:0;
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
  text-align:center;\
  position:fixed;
  bottom:0;
  left:0;
`
class App extends Component {
  render() {
    return (
        <Layout>
            <Header />
            <Main />
            {/* <Cards />  */}
            {/* <Footer>Footer</Footer> */}
        </Layout>
    );
  }
}


export default App;