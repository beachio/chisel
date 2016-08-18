import {Parse} from 'parse';

import {store} from '../index';
import {getLocalStorage} from 'ducks/user';


export const INITIALIZE_APP_START   = 'app/initialize/INITIALIZE_APP_START';
export const INITIALIZE_APP_END     = 'app/initialize/INITIALIZE_APP_END';

const ENDPOINT = "https://parse.nuwe.co:49178/parse";
const APP_ID = "d5701a37cf242d5ee398005d997e4229";
const CLIENT_KEY = "2b868e90b0af18609993e4575628784d";


function subInitParse() {
  Parse.initialize(APP_ID, CLIENT_KEY);
  Parse.serverURL = ENDPOINT;
}

export function initApp() {
  subInitParse();
  store.dispatch(getLocalStorage());
  return {
    type: INITIALIZE_APP_END
  };
}


const initialState = {
  initializedApp: false
};

export default function initializeReducer(state = initialState, action) {
  switch (action.type) {
    case INITIALIZE_APP_START:
      return state;

    case INITIALIZE_APP_END:
      return {...state, initializedApp: true};

    default:
      return state;
  }
}
