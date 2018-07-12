import React, { Component } from 'react';
//import _ from 'lodash';
import { connect } from 'react-redux';

import Row from './row';
import { resolveModelo, geraMatrizString } from '../actions';


class Tableau extends Component {
  numeroTableaus() {
    return Object.keys(this.props.modelos).length;
  }

  componentDidMount() {
    this.props.geraMatrizString(this.props.modelos, this.props.formato.tipo, this.props.tableauAtual);
  }

  renderTableau() {
    const matrizes_string = this.props.formato.tabela;
    var linha = 0;

    if(matrizes_string) {
      return (
        matrizes_string.map( (row) => {
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
    modelos: state.modelos,
    formato: state.formato
  };
}

 export default connect(mapStateToProps, { resolveModelo, geraMatrizString })(Tableau);
