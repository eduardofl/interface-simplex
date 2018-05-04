import React, { Component } from 'react';

import Celula from './celula';

class Row extends Component {
  renderRow(){
    if(this.props.data) {
      var coluna = 0;
      return (
        this.props.data.map( cel => {
          coluna = coluna +1;
          return <Celula conteudo={cel} linha={this.props.linha} coluna={coluna} key={coluna}/>
        })
      );
    }
  }

  render() {
    return (
      <tr>
        {this.renderRow()}
      </tr>
    );
  }
}

export default Row;
