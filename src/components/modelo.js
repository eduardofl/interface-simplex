import React, { Component } from 'react';
import { connect } from 'react-redux';
import { resolveModelo } from '../actions';

//modelo a ser resolvido, alimentado à mão antes da implementação do parsing
/*const modelo = {
  iteracoes: 0,
  var_decisao: ["x", "y", "z"],
  var_folga: ["X4", "X5", "X6"],
  var_basicas: ["X4", "X5", "X6"],
  coef_func_obj: ['3', '2', '5', '0', '0', '0'],
  valor_func_obj: '0',
  coeficientes: [
    ['1', '2', '1', '1', '0', '0'],
    ['3', '0', '2', '0', '1', '0'],
    ['1', '4', '0', '0', '0', '1']
  ],
  coef_xb: ['430', '460', '420']
};*/

/*const modelo = {
  iteracoes: 0,
  var_decisao: ["x", "y"],
  var_folga: ["X3", "X4", "X5"],
  var_basicas: ["X3", "X4", "X5"],
  coef_func_obj: ['0.2', '0.1', '0', '0', '0'],
  valor_func_obj: '0',
  coeficientes: [
    ['0', '0.1', '1', '0', '0'],
    ['0.25', '0', '0', '1', '0'],
    ['3', '2', '0', '0', '1']
  ],
  coef_xb: ['200', '800', '12000']
};*/

//com frações
/*const modelo = {
  iteracoes: 0,
  var_decisao: ["x", "y"],
  var_folga: ["X3", "X4", "X5"],
  var_basicas: ["X3", "X4", "X5"],
  coef_func_obj: ['1/5', '1/10', '0', '0', '0'],
  valor_func_obj: '0',
  coeficientes: [
    ['0', '1/10', '1', '0', '0'],
    ['1/4', '0', '0', '1', '0'],
    ['3', '2', '0', '0', '1']
  ],
  coef_xb: ['200', '800', '12000']
};*/

class Modelo extends Component {
  constructor(props) {
    super(props);
    this.state = {texto_modelo: '', texto_alerta: ''};

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({texto_modelo: e.target.value, texto_alerta: ""});
  }

  exemploModelo() {
    const modelo_exemplo = "Max 3x + 2y + 5z\nst\nx + 2y + z <= 430\n3x + 2z <= 460\nx + 4y <= 420";
    this.setState({texto_modelo: modelo_exemplo, texto_alerta: ""});
  }

  limparModelo() {
    this.setState({texto_modelo: ""});
  }

  resolveModelo() {
    if(this.state.texto_modelo === "") {
      this.setState({texto_alerta: "Modelo inválido. Verifique a sintaxe e tente novamente."});
    } else {
      this.props.resolveModelo(this.state.texto_modelo);
    }
  }

  render() {

    return (
      <div className="container-fluid modelo-container">
        <div className="row">
          <div className="col-sm-3"></div>
          <div className="col-sm-8">
            <label>Modelo:</label>
          </div>
        </div>
        <div className="form-group row justify-content-md-center">
          <div className="col-sm-4 text-xs-right">
            <textarea className="form-control" id="modeloTextArea" rows="5" value={this.state.texto_modelo} onChange={ this.handleChange }></textarea>
            <span className="text-danger">{this.state.texto_alerta}</span>
          </div>
          <div className="col-sm-2 text-xs-left">
            <div className="btn-group-vertical">
              <button className="btn btn-primary" onClick={ () => {this.resolveModelo()} }>Resolver</button>
              <button className="btn btn-primary" onClick={ () => {this.exemploModelo()} }>Exemplo</button>
              <button className="btn btn-primary" onClick={ () => {this.limparModelo()} }>Limpar</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect( null, { resolveModelo } )(Modelo);
