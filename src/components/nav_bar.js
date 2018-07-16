import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { exportaTableaus, importaArquivo } from '../actions';

var FileSaver = require('file-saver');

class NavBar extends Component {
  atualizaPagina() {
    window.location.reload();
  }

  importaArquivo() {
    var file = document.getElementById("entrada_arquivo").files[0], reader = new FileReader();

    reader.onload = (e) => {
        this.props.importaArquivo(e.target.result);
    };

    reader.readAsText(file);
  }

  exportaSolucao() {
    if(_.isEmpty(this.props.modelos)) {
      document.getElementById("myCheck").click();
    } else {
      const arquivo_txt = this.props.exportaTableaus(this.props.modelos, this.props.tipo);

      var blob = new Blob([arquivo_txt.payload], {type: "text/plain;charset=utf-8"});
      FileSaver.saveAs(blob, "solucao.txt");
    }
  }

  render() {
    return(
      <div>
        <header>
          <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <span className="navbar-brand btn" onClick={this.atualizaPagina.bind(this)}>Início</span>

            <div className="nav-item dropdown">
              <button className="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Arquivos
              </button>
              <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <button className="dropdown-item" data-toggle="modal" data-target="#modalImportar">Importar</button>
                <button className="dropdown-item" data-toggle="modal" data-target="#modalExportar">Exportar</button>
              </div>
            </div>
          </nav>
        </header>

        <div className="modal fade" id="modalImportar" tabIndex="-1" role="dialog" aria-labelledby="importarArquivo" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="importarArquivo">Importar arquivo</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>Para importar, selecione um arquivo de texto que contenha o modelo com a sintaxe como indicada:</p>
                <input
                  type="file"
                  id="entrada_arquivo"
                  accept="text/plain"
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={ () => {this.importaArquivo()} }>Importar</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalExportar" tabIndex="-1" role="dialog" aria-labelledby="exportarArquivo" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exportarArquivo">Exportar arquivo</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                Deseja exportar as soluções para um arquivo de texto ?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button type="button" className="btn btn-primary" onClick={ () => {this.exportaSolucao()} } data-dismiss="modal">Sim</button>
              </div>
            </div>
          </div>
        </div>

        <button hidden="true" data-toggle="modal" data-target="#modalErro" id="myCheck"></button>
        <div className="modal fade" id="modalErro" tabIndex="-1" role="dialog" aria-labelledby="erroAoExportar" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-danger" id="erroAoExportar">Erro ao exportar</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                Não há nenhuma solução para ser exportada no momento. Por favor, resolva um modelo e tente novamente.
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" data-dismiss="modal">OK</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    modelos: state.modelos.modelos,
    tipo: state.formato.tipo
  };
}

export default connect(mapStateToProps, { exportaTableaus, importaArquivo })(NavBar);
