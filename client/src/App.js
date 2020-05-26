import React from 'react';
import Main from './containers/Main';
import Header from './containers/Header';
import './styles/App.css';
import Cards from './containers/Cards';

function App() {
  return (
    <div className="App">
      <Header />
      <Main />
      {/* <Cards /> */}
    </div>
  );
}

export default App;
