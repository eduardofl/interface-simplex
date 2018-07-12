import { RESOLVE_MODELO } from '../actions';

export default function(state = {}, action) {
  switch(action.type) {

    case RESOLVE_MODELO:
      const modelos_resolucao = action.payload;
      return { ...state, ...modelos_resolucao };

    default:
      return state;
  }
}
