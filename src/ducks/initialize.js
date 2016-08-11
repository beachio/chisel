import {store} from '../index';

import {LOGIN_RESPONSE, REGISTER_RESPONSE} from './user';


export const INITIALIZE  = 'app/initialize/INITIALIZE';


export function initialize(pageType) {
  return {
    type: INITIALIZE,
    pageType
  };
}

const initialState = {
  initialized: false
};

export default function initializeReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_RESPONSE:
    case REGISTER_RESPONSE:
      if (action.authorized)
        return { ...state, initialized: true };
      else
        return state;

    default:
      return state;
  }
}
