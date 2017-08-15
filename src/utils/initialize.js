import {Parse} from 'parse';

import {store} from 'index';
import {getLocalStorage} from 'ducks/user';
import {config} from 'constants';


export let currentServerURL;


function requestConfig() {
  return fetch('/chisel-config.json')
    .then(response => {
      if (response.ok)
        return response.json();
      throw new Error(response.statusText);
    })
    .then(res => {
      config.serverURL  = res.configServerURL;
      config.appId      = res.configAppId;
      config.JSkey      = res.configJSkey;
      config.RESTkey    = res.configRESTkey;
    });
}

function subInitParse() {
  currentServerURL = config.serverURL;

  /*let serverLS = localStorage.getItem('parseServerURL');
  if (serverLS)
    currentServerURL = serverLS;
  else
    localStorage.setItem('parseServerURL', currentServerURL);*/
  
  Parse.initialize(config.appId, config.JSkey);
  Parse.serverURL = currentServerURL;
}

export function initApp() {
  requestConfig()
    .then(() => {
      subInitParse();
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