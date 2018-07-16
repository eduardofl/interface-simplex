import React, { Component } from 'react';
import _ from 'lodash';
import Ionicon from 'react-ionicons';
import { connect } from 'react-redux';

import Tableau from './tableau';
import { proximoTableau, tableauAnterior, geraMatrizString, atualizaPivo } from '../actions';

class NavegacaoTableaus extends Component {
  // volta um tableau na navegação e atualiza as informações com os novos dados
  tableauAnterior(tableau_atual, num_tableaus) {
    if(tableau_atual === 0) {
      this.props.tableauAnterior(tableau_atual);
    } else {
      this.props.geraMatrizString(this.props.modelos.modelos, this.props.tipo, tableau_atual - 1);
      this.props.atualizaPivo(this.props.modelos, num_tableaus, tableau_atual - 1);
      this.props.tableauAnterior(tableau_atual);
    }

  }

  // avança um tableau na navegação e atualiza as informações com os novos dados
  proximoTableau(tableau_atual, num_tableaus) {
    if(tableau_atual === (num_tableaus - 1)) {
      this.props.proximoTableau(tableau_atual, num_tableaus);
    } else {
      this.props.geraMatrizString(this.props.modelos.modelos, this.props.tipo, tableau_atual + 1);
      this.props.atualizaPivo(this.props.modelos, num_tableaus, tableau_atual + 1);
      this.props.proximoTableau(tableau_atual, num_tableaus);
    }
  }

  render() {
    const tableau_atual = this.props.navegacao;
    const num_tableaus = Object.keys(this.props.modelos.modelos).length;
    const inicial = (tableau_atual === 0) ? " - Tableau inicial" : "";
    const otima = ((tableau_atual + 1) === num_tableaus) ? "- Solução ótima" : "";

    if(_.isEmpty(this.props.modelos.modelos)) {
      const exemplo_sintaxe = "Max 3x + 2y + 5z\nst\nx + 2y + z <= 430\n3x + 2z <= 460\nx + 4y <= 420";
      return (
        <div className="row justify-content-md-center align-items-center">
          <div className="painel-exemplo-sintaxe col-sm-8">
            <div className="p-3 mb-2 bg-light text-secondary">
              <span>Por favor, utilize a seguinte sintaxe para o modelo:</span>
              <code><pre>{exemplo_sintaxe}</pre></code>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="container-fluid">
          <div className="row justify-content-md-center align-items-center">
            <div className="col-sm-1">
              <Ionicon icon="md-arrow-round-back" fontSize="45px" onClick={() => {this.tableauAnterior(tableau_atual, num_tableaus)}} color="#007bff"/>
            </div>
            <div className="col">
              <div className="row justify-content-md-left align-items-left">
                <span className="label-tableau">{`#TABLEAU ${tableau_atual + 1}${inicial} ${otima}`}</span>
              </div>
              <div className="row"><Tableau tableauAtual={tableau_atual} /></div>
            </div>
            <div className="col-sm-1">
              <Ionicon icon="md-arrow-round-forward" fontSize="45px" onClick={() => {this.proximoTableau(tableau_atual, num_tableaus)}} color="#007bff"/>
            </div>
          </div>
        </div>
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    modelos: state.modelos,
    navegacao: state.navegacao,
    tipo: state.formato.tipo
  };
}

export default connect(mapStateToProps, { proximoTableau, tableauAnterior, geraMatrizString, atualizaPivo })(NavegacaoTableaus);
