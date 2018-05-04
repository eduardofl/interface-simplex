import { RECEBE_MODELO } from '../actions';
import { RESOLVE_MODELO } from '../actions';

export default function(state = {}, action) {
  switch(action.type) {
    case RECEBE_MODELO:
      const modelo = action.payload;
      return { ...state, [modelo.iteracoes]: modelo };

    case RESOLVE_MODELO:
      const modelos_resolucao = action.payload;
      return { ...state, ...modelos_resolucao };

    default:
      return state;
  }
}