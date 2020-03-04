import React, { Component } from 'react';
import classes from './App.css';
import Auxi from './hoc/Auxi/Auxi';
import Layout from './components/Layout/Layout';
import Main from './containers/Main/Main';

// Testing
import Cards from './containers/Cards/Cards';

class App extends Component {
  render() {
    return (
      <Auxi>
        <Layout>
          <div className={classes.App}>
            <Main />
            {/* <Cards /> */}
          </div>
        </Layout>
      </Auxi>
    );
  }
}


export default App;