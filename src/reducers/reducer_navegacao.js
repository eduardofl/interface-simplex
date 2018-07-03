import { TABLEAU_ANTERIOR } from '../actions';
import { PROXIMO_TABLEAU } from '../actions';
import { TABLEAU_INICIAL } from '../actions';

export default function(state = 0, action) {
  switch(action.type) {
    case TABLEAU_ANTERIOR:
      return action.payload;

    case PROXIMO_TABLEAU:
      return action.payload;

    case TABLEAU_INICIAL:
      return action.payload;

    default:
      return state;
  }
}
