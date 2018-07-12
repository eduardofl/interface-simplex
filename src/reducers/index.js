import { combineReducers } from 'redux';
import ModelosReducer from './reducer_modelos';
import NavReducer from './reducer_navegacao';
import FormatoReducer from './reducer_formato';
import { RESOLVE_MODELO } from '../actions';

const appReducer = combineReducers({
  modelos: ModelosReducer,
  navegacao: NavReducer,
  formato: FormatoReducer
});

const rootReducer = (state, action) => {
  if (action.type === RESOLVE_MODELO && state !== {}) {
    state = undefined;
  }

  return appReducer(state, action);
}

export default rootReducer;
