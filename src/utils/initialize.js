import {Parse} from 'parse';

import {store} from 'index';
import {getLocalStorage} from 'ducks/user';
import {config as _config} from 'ConnectConstants';


export const config = {};


async function requestConfig() {
  config.serverURL  = process.env.REACT_APP_SERVER_URL  || _config.serverURL;
  config.appId      = process.env.REACT_APP_APP_ID      || _config.appId;
  config.JSkey      = process.env.JS_KEY                || _config.JSkey;
  config.RESTkey    = process.env.REST_KEY              || _config.RESTkey;

  const response = await fetch('/chisel-config.json');
  if (!response.ok)
    return;

  const result = await response.json();
  config.serverURL = result.configServerURL || config.serverURL;
  config.appId = result.configAppId || config.appId;
  config.JSkey = result.configJSkey || config.JSkey;
  config.RESTkey = result.configRESTkey || config.RESTkey;
}

function subInitParse() {
  Parse.initialize(config.appId, config.JSkey);
  Parse.serverURL = config.serverURL;
}

export async function initApp() {
  await requestConfig();
  subInitParse();
  store.dispatch(getLocalStorage());
}

export function changeServerURL(URL) {
  if (!URL)
    return;
  
  config.serverURL = URL;
  localStorage.setItem('parseServerURL', URL);
  Parse.serverURL = URL;
}
