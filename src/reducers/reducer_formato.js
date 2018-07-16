import { TROCA_FORMATO, GERA_MATRIZ, ATUALIZA_PIVO, IMPORTA_ARQUIVO, FRACAO } from '../actions';

const initialState = {
  tipo: FRACAO,
  pivo: {},
  texto_arquivo: null,
  tabelas: null
}

export default function(state = initialState, action) {
  switch(action.type) {
    case TROCA_FORMATO:
    return Object.assign({}, state, {
      tipo: action.payload
    });

    case GERA_MATRIZ:
    return Object.assign({}, state, {
      tabela: action.payload
    });

    case ATUALIZA_PIVO:
    return Object.assign({}, state, {
      pivo: action.payload
    });

    case IMPORTA_ARQUIVO:
    return Object.assign({}, state, {
      texto_arquivo: action.payload
    });

    default:
      return state;
  }
}
