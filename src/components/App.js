import React, { Component } from 'react';

import NavBar from './nav_bar';
import Modelo from './modelo';
import NavegacaoTableaus from './navegacao_tableaus';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {texto_arquivo: ''};
  }

  handleArquivo(texto){
    this.setState({texto_arquivo: texto});
  }

  render() {
    //var texto = this.state.texto_arquivo;
    //console.log(this.state.texto_arquivo);
    if(this.state.texto_arquivo === '') {
      return (
        <div className="App">
          <NavBar onFileSelect={this.handleArquivo.bind(this)}/>
          <Modelo />
          <NavegacaoTableaus />
        </div>
      );
    } else {
      return (
        <div className="App">
          <NavBar onFileSelect={this.handleArquivo.bind(this)}/>
          <Modelo texto={this.state.texto_arquivo} />
          <NavegacaoTableaus />
        </div>
      );
    }
  }
}

export default App;
