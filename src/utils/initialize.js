import {Parse} from 'parse';

import {store} from 'index';
import {getLocalStorage} from 'ducks/user';
import {config} from 'ConnectConstants';


export let currentServerURL;


function requestConfig() {
  config.serverURL = process.env.REACT_APP_SERVER_URL ||  config.serverURL;
  config.appId = process.env.REACT_APP_APP_ID || config.appId;
  config.JSkey = process.env.JS_KEY || config.JSkey;
  config.RESTkey = process.env.REST_KEY || config.RESTkey;

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
    })
    .catch(() => {});
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
      console.log(e);
      /*setTimeout(() => {
        localStorage.clear();
        window.location = "/";
      }, 1000);*/
    });
}

export function changeServerURL(URL) {
  if (!URL)
    return;
  
  currentServerURL = URL;
  localStorage.setItem('parseServerURL', URL);
  Parse.serverURL = URL;
}