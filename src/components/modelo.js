import React, { Component } from 'react';
import { connect } from 'react-redux';
import { resolveModelo } from '../actions';

class Modelo extends Component {
  constructor(props) {
    super(props);
    this.state = {texto_modelo: '', texto_alerta: ''};
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

  onDragOver(e) {
    e.preventDefault();
    e.target.className = 'form-control hover';
  }

  onDragEnd(e) {
    e.target.className = 'form-control';
  }

  onDrop(e) {
      e.target.className = 'form-control';
      e.preventDefault();

      var file = e.dataTransfer.files[0], reader = new FileReader();
      reader.onload = (event) => {
          //console.log(event.target);
          //const texto = (event.target.result).toString();
          //const texto = (' ' + event.target.result).slice(1);
          this.setState({texto_modelo: event.target.result});
      };

      reader.readAsText(file);
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
            <textarea
              className="form-control"
              id="modeloTextArea"
              rows="5"
              value={this.state.texto_modelo}
              onChange={this.handleChange.bind(this)}
              onDragOver={this.onDragOver.bind(this)}
              onDragEnd={this.onDragEnd.bind(this)}
              onDrop={this.onDrop.bind(this)}>
            </textarea>
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

export default connect( null, { resolveModelo })(Modelo);
