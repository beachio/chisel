import {Parse} from 'parse';

import {store} from 'index';
import {getLocalStorage} from 'ducks/user';
import {config as _config} from 'ConnectConstants';


export const config = {};


function requestConfig() {
  config.serverURL  = process.env.REACT_APP_SERVER_URL  || _config.serverURL;
  config.appId      = process.env.REACT_APP_APP_ID      || _config.appId;

  return fetch('/chisel-config.json')
    .then(response => {
      if (response.ok)
        return response.json();
      throw response.statusText;
    })
    .then(res => {
      config.serverURL  = res.configServerURL || config.serverURL;
      config.appId      = res.configAppId     || config.appId;
    })
    .catch(() => {});
}

function subInitParse() {
  Parse.initialize(config.appId);
  Parse.serverURL = config.serverURL;
}

export function initApp() {
  requestConfig()
    .then(() => {
      subInitParse();
      store.dispatch(getLocalStorage());
    })
    .catch(e => {
      console.log(e);
      //halt();
    });
}

export function changeServerURL(URL) {
  if (!URL)
    return;
  
  config.serverURL = URL;
  localStorage.setItem('parseServerURL', URL);
  Parse.serverURL = URL;
}
