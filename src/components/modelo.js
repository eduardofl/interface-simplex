import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FRACAO, DECIMAL } from '../actions';
import { resolveModelo, importaArquivo, trocaFormato, geraMatrizString } from '../actions';

class Modelo extends Component {
  constructor(props) {
    super(props);

    this.radioChange = this.radioChange.bind(this);
    this.state = {texto_modelo: '', texto_alerta: ''};
  }

  componentDidMount() {
    if(this.props.formato.texto_arquivo) {
      this.importaTexto(this.props.formato.texto_arquivo);
    }
  }

  alteraTexto(novo_texto) {
    this.setState({texto_modelo: novo_texto, texto_alerta: ""});
  }

  handleChange(e) {
    this.alteraTexto(e.target.value);
  }

  importaTexto(texto_arquivo) {
    this.setState({texto_modelo: texto_arquivo, texto_alerta: ""});
    this.props.importaArquivo("");
  }

  exemploModelo() {
    const modelo_exemplo = "Max 3x + 2y + 5z\nst\nx + 2y + z <= 430\n3x + 2z <= 460\nx + 4y <= 420";
    this.alteraTexto(modelo_exemplo);
  }

  limparModelo() {
    this.alteraTexto("");
  }

  radioChange(e) {
    switch(e.target.value) {
      case 'fracao':
        if(this.props.formato.tipo === DECIMAL) {
          this.props.trocaFormato(e.target.value);
          this.props.geraMatrizString(this.props.modelos, e.target.value, this.props.tableauAtual);
        }
        break;

      case 'decimal':
        if(this.props.formato.tipo === FRACAO) {
          this.props.trocaFormato(e.target.value);
          this.props.geraMatrizString(this.props.modelos, e.target.value, this.props.tableauAtual);
        }
        break;

      default: break;
    }
  }

  resolveModelo(texto_modelo) {
    if(texto_modelo === "" || !texto_modelo) {
      this.setState({texto_alerta: "Modelo inválido. Verifique a sintaxe e tente novamente."});
    } else {

      this.props.resolveModelo(texto_modelo);
    }
  }

  render() {
    return (
      <div className="container-fluid modelo-container">
        <div className="row">
          <div className="col-sm-2"></div>
          <div className="col-sm-9">
            <label>Modelo:</label>
          </div>
        </div>
        <div className="form-group row justify-content-md-center">
          <div className="col-sm-4 text-xs-right">
            <textarea
              className="form-control"
              id="modeloTextArea"
              rows="5"
              value={this.state.texto_modelo}
              onChange={this.handleChange.bind(this)}>
            </textarea>
            <span className="text-danger">{this.state.texto_alerta}</span>
          </div>
          <div className="col-sm-1 text-xs-left">
            <div className="btn-group-vertical">
              <button className="btn btn-primary" onClick={ () => {this.resolveModelo(this.state.texto_modelo)} }>Resolver</button>
              <button className="btn btn-primary" onClick={ () => {this.exemploModelo()} }>Exemplo</button>
              <button className="btn btn-primary" onClick={ () => {this.limparModelo()} }>Limpar</button>
            </div>
          </div>
          <div className="col-sm-3 text-xs-left">
            <table className="table table-sm">
              <thead>
                <tr><td className="table-secondary">Exibir os números no formato:</td></tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="radioFormato" id="radioFracao"
                        value="fracao" checked={this.props.formato.tipo === FRACAO} onChange={this.radioChange}/>
                      <label className="form-check-label">
                        Fração
                      </label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="radioFormato" id="radioDecimal"
                        value="decimal" checked={this.props.formato.tipo === DECIMAL} onChange={this.radioChange}/>
                      <label className="form-check-label">
                        Decimal
                      </label>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    modelos: state.modelos.modelos,
    tableauAtual: state.navegacao,
    formato: state.formato
  };
}

export default connect(mapStateToProps, { resolveModelo, importaArquivo, trocaFormato, geraMatrizString })(Modelo);
