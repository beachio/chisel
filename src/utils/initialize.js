import {Parse} from 'parse';

import {store} from '../index';
import {getLocalStorage} from 'ducks/user';


//const SERVER_URL = "https://parse.nuwe.co:49178/parse";
export const SERVER_URL = "http://localhost:1337/parse";
export const SITE_URL = "http://localhost:3000";
const APP_ID = "d5701a37cf242d5ee398005d997e4229";

export let currentServerURL = SERVER_URL;


function subInitParse() {
  let serverLS = localStorage.getItem('parseServerURL');
  if (serverLS)
    currentServerURL = serverLS;
  else
    localStorage.setItem('parseServerURL', currentServerURL);
  
  Parse.initialize(APP_ID);
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