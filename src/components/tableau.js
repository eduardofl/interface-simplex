import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

import Row from './row';
import { resolveModelo } from '../actions';

const matriz_vazia = [
  ["Variaveis basicas", " ", " ", " ", " ", " ", "Valores de -f e Xb"],
  ["-f", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " "]
];

class Tableau extends Component {
  numeroTableaus() {
    return Object.keys(this.props.modelos).length;
  }

  geraMatrizesString(){
    if(_.isEmpty(this.props.modelos)) {
      return null;
    } else {
      return _.map(this.props.modelos, modelo => {
        return [
          ["Variaveis basicas", ...modelo.var_decisao, ...modelo.var_folga, "Valores de -f e Xb"],
          ["-f", ...modelo.coef_func_obj, modelo.valor_func_obj],
          [modelo.var_basicas[0], ...modelo.coeficientes[0], modelo.coef_xb[0]],
          [modelo.var_basicas[1], ...modelo.coeficientes[1], modelo.coef_xb[1]],
          [modelo.var_basicas[2], ...modelo.coeficientes[2], modelo.coef_xb[2]]
        ];
      });
    }
  }

  renderTableau() {
    const matrizes_string = this.geraMatrizesString();
    var linha = 0;

    if(!matrizes_string) {
      return (
        matriz_vazia.map( (row) => {
          linha = linha + 1;
          return (
            <Row data={row} linha={linha} key={linha}/>
          );
        })
      );
    } else {
      return (
        matrizes_string[this.props.tableauAtual].map( (row) => {
          linha = linha + 1;
          return (
            <Row data={row} linha={linha} key={linha}/>
          );
        })
      );
    }
  }

  render() {
    return (
      <div className="table-responsive">
        <table className="table table-bordered">
          <tbody>
            {this.renderTableau()}
          </tbody>
        </table>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    modelos: state.modelos
  };
}

 export default connect(mapStateToProps, { resolveModelo })(Tableau);
