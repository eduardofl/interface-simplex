import React, { Component } from 'react';

class NavBar extends Component {
  atualizaPagina() {
    window.location.reload();
  }

  render() {
    return(
      <header>
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <span className="navbar-brand btn" onClick={this.atualizaPagina.bind(this)}>Início</span>

          <div className="nav-item dropdown">
            <button className="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Arquivos
            </button>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <button className="dropdown-item">Importar</button>
              <button className="dropdown-item">Exportar</button>
            </div>
          </div>
        </nav>
      </header>
    );
  }
}

export default NavBar;
