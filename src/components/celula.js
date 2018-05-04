import React, { Component } from 'react';

class Celula extends Component {
  getKey() {
    return `Linha ${this.props.linha}/Coluna ${this.props.coluna}`;
  }

  render() {
    return (
      <td key={this.getKey()} onClick={ () => { console.log(this.getKey()); }}>{this.props.conteudo}</td>
    );
  }
}

export default Celula;
