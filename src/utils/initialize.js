import {Parse} from 'parse';

import {store} from 'index';
import {getLocalStorage} from 'ducks/user';
import {SERVER_URL, APP_ID, JS_KEY} from 'constants';


export let currentServerURL = SERVER_URL;


function subInitParse() {
  let serverLS = localStorage.getItem('parseServerURL');
  if (serverLS)
    currentServerURL = serverLS;
  else
    localStorage.setItem('parseServerURL', currentServerURL);
  
  Parse.initialize(APP_ID, JS_KEY);
  Parse.serverURL = currentServerURL;
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

export function changeServerURL(URL) {
  if (!URL)
    return;
  
  currentServerURL = URL;
  localStorage.setItem('parseServerURL', URL);
  Parse.serverURL = URL;
}