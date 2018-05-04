import React, { Component } from 'react';

import NavBar from './nav_bar';
import Modelo from './modelo';
import NavegacaoTableaus from './navegacao_tableaus';

class App extends Component {
  render() {
    return (
      <div className="App">
        <NavBar />
        <Modelo />
        <NavegacaoTableaus />
      </div>
    );
  }
}

export default App;
