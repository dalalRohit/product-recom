import React, { Component } from 'react';
import styled from 'styled-components';

import Main from './containers/Main/Main';
import Header from './containers/Header/Header';
// Testing
import Cards from './containers/Cards/Cards';

const Layout=styled.div`
    width:100%;
    max-width:100%;
    margin:0;
    padding:0;
    box-sizing:border-box;
    background-color: #eee;
`;

class App extends Component {
  render() {
    return (
        <Layout>
            <Header />
            <Main />
            {/* <Cards /> */}
        </Layout>
    );
  }
}


export default App;