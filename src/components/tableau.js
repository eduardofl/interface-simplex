import React, { Component } from 'react';
import { connect } from 'react-redux';

import Row from './row';
import { resolveModelo, geraMatrizString, atualizaPivo } from '../actions';


class Tableau extends Component {
  numeroTableaus() {
    return Object.keys(this.props.modelos.modelos).length;
  }

  componentDidMount() {
    this.props.geraMatrizString(this.props.modelos.modelos, this.props.formato.tipo, this.props.tableauAtual);
    this.props.atualizaPivo(this.props.modelos, this.numeroTableaus(), this.props.tableauAtual);
  }

  renderTableau() {
    const matrizes_string = this.props.formato.tabela;
    const pivo = this.props.formato.pivo;
    var linha = 0;

    if(matrizes_string) {
      return (
        matrizes_string.map( (row) => {
          return (
            <Row data={row} linha={linha++} key={linha} pivo={pivo}/>
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
    modelos: state.modelos,
    formato: state.formato
  };
}

 export default connect(mapStateToProps, { resolveModelo, geraMatrizString, atualizaPivo })(Tableau);
