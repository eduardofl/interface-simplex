import { combineReducers } from 'redux';
import ModelosReducer from './reducer_modelos';
import NavReducer from './reducer_navegacao';

const rootReducer = combineReducers({
  modelos: ModelosReducer,
  navegacao: NavReducer
});

export default rootReducer;
