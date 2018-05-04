import React, { Component } from 'react';
import Ionicon from 'react-ionicons';
import { connect } from 'react-redux';

import Tableau from './tableau';
import { proximoTableau, tableauAnterior } from '../actions';

class NavegacaoTableaus extends Component {

  render() {
    const tableauAtual = this.props.navegacao;
    const numTableaus = Object.keys(this.props.modelos).length;

    return (
      <div className="container-fluid">
        <div className="row justify-content-md-center align-items-center">
          <div className="col-sm-1">
            <Ionicon icon="md-arrow-round-back" fontSize="45px" onClick={ () => { this.props.tableauAnterior(tableauAtual); } } color="#007bff"/>
          </div>
          <div className="col">
            <Tableau tableauAtual={tableauAtual} />
          </div>
          <div className="col-sm-1">
            <Ionicon icon="md-arrow-round-forward" fontSize="45px" onClick={ () => { this.props.proximoTableau(tableauAtual, numTableaus); } } color="#007bff"/>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    modelos: state.modelos,
    navegacao: state.navegacao
  };
}

export default connect(mapStateToProps, { proximoTableau, tableauAnterior })(NavegacaoTableaus);
