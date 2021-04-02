import {Parse} from 'parse';

import {store, setStripeKey} from 'index';
import {getLocalStorage} from 'ducks/user';
import {config as _config} from 'ConnectConstants';
import {send} from 'utils/server';


// loading config from ConnectConstants
export const config = {..._config};


async function requestConfig() {
  //try to load config from process.env
  if (typeof process !== 'undefined' && process) {
    config.serverURL  = process.env.REACT_APP_SERVER_URL  || config.serverURL;
    config.appId      = process.env.REACT_APP_APP_ID      || config.appId;
    config.JSkey      = process.env.JS_KEY                || config.JSkey;
    config.RESTkey    = process.env.REST_KEY              || config.RESTkey;
  }

  //try to load config from local running
  try {
    const response = await fetch('/chisel-config.json');
    const result = await response.json();
    config.serverURL  = result.configServerURL  || config.serverURL;
    config.appId      = result.configAppId      || config.appId;
    config.JSkey      = result.configJSkey      || config.JSkey;
    config.RESTkey    = result.configRESTkey    || config.RESTkey;
  } catch (e) {}

  //try to load config from Electron
  try {
    const prefix = '--chisel-server=';
    const {argv} = window.process;
    for (let arg of argv) {
      if (arg.indexOf(prefix) == 0) {
        const result = JSON.parse(arg.substr(prefix.length));

        config.serverURL  = result.URL        || config.serverURL;
        config.appId      = result.appId      || config.appId;
        config.JSkey      = result.JSkey      || config.JSkey;
        config.RESTkey    = result.RESTkey    || config.RESTkey;
      }
    }
  } catch (e) {}
}

async function initParse() {
  Parse.initialize(config.appId, config.JSkey);
  Parse.serverURL = config.serverURL;
  
  const appConfig = await send(Parse.Config.get());
  if (appConfig) {
    const key = appConfig.get('StripeKeyPublic');
    if (key) {
      config.stripeKeyExists = true;
      setStripeKey(key);
    }
  }
}

export async function initApp() {
  await requestConfig();
  await initParse();
  store.dispatch(getLocalStorage());
}

export function changeServerURL(URL) {
  if (!URL)
    return;
  
  config.serverURL = URL;
  localStorage.setItem('parseServerURL', URL);
  Parse.serverURL = URL;
}
