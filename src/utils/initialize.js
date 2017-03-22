import {Parse} from 'parse';

import {store} from '../index';
import {getLocalStorage} from 'ducks/user';


//const SERVER = "https://parse.nuwe.co:49178/parse";
const SERVER = "http://localhost:1337/parse";
const APP_ID = "d5701a37cf242d5ee398005d997e4229";


function subInitParse() {
  Parse.initialize(APP_ID);
  Parse.serverURL = SERVER;
}

export function initApp() {
  subInitParse();

  new Promise((resolve, reject) => {
    store.dispatch(getLocalStorage());
  })
    .catch(e => {
      setTimeout(() => {
        localStorage.clear();
        window.location = "/";
      }, 1000);
    });
}
