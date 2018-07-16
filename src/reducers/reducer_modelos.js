import { RESOLVE_MODELO } from '../actions';

const initialState = {
  tableaus_dual: null,
  modelos: {}
}

export default function(state = initialState, action) {
  switch(action.type) {
    case RESOLVE_MODELO:
      const modelos_resolucao = action.payload.modelos;
      return Object.assign({}, state, {
        tableaus_dual: action.payload.tableaus_dual,
        modelos: { ...modelos_resolucao }
      });

    default:
      return state;
  }
}
