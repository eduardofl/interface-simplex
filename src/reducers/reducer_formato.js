import { TROCA_FORMATO, GERA_MATRIZ, FRACAO } from '../actions';

const initialState = {
  tipo: FRACAO,
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

    default:
      return state;
  }
}
