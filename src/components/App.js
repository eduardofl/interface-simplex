import React, { Component } from 'react';
import { connect } from 'react-redux';
import { importaArquivo } from '../actions';

import NavBar from './nav_bar';
import Modelo from './modelo';
import NavegacaoTableaus from './navegacao_tableaus';

class App extends Component {
  render() {
    if(!this.props.texto_arquivo) {
      return (
        <div className="App">
          <NavBar />
          <Modelo />
          <NavegacaoTableaus />
        </div>
      );
    } else {
      return (
        <div className="App">
          <NavBar />
          <Modelo texto={this.props.texto_arquivo} />
          <NavegacaoTableaus />
        </div>
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    texto_arquivo: state.formato.texto_arquivo
  };
}

export default connect(mapStateToProps, { importaArquivo })(App);
