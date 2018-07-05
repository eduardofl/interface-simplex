import { TABLEAU_ANTERIOR } from '../actions';
import { PROXIMO_TABLEAU } from '../actions';

export default function(state = 0, action) {
  switch(action.type) {
    case TABLEAU_ANTERIOR:
      return action.payload;

    case PROXIMO_TABLEAU:
      return action.payload;

    default:
      return state;
  }
}
