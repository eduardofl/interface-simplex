import React, { Component } from 'react';

class Celula extends Component {
  getKey() {
    return `Linha ${this.props.linha}/Coluna ${this.props.coluna}`;
  }

  render() {
    const pivo = this.props.pivo;
    var classe = "";

    if(this.props.linha - 2 === pivo.linha && this.props.coluna - 1 === pivo.coluna) {
      classe = "bg-primary";
    } else if(this.props.linha - 2 === pivo.linha) {
      classe = "table-danger";
    } else if (this.props.coluna - 1 === pivo.coluna) {
      classe = "table-primary";
    }

    return (
      <td className={classe} key={this.getKey()} onClick={ () => { console.log(this.getKey()); }}>{this.props.conteudo}</td>
    );
  }
}

export default Celula;
