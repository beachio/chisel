import {store} from 'index';
import {setServerProblemA, setServerProblemB} from "ducks/nav";


export const PARSE_ERROR_CODE__CONNECTION_FAILED      = 100;
export const PARSE_ERROR_CODE__OBJECT_NOT_FOUND       = 101;
export const PARSE_ERROR_CODE__CLOUD_FAIL             = 141;
export const PARSE_ERROR_CODE__USERNAME_TAKEN         = 202;
export const PARSE_ERROR_CODE__EMAIL_TAKEN            = 203;
export const PARSE_ERROR_CODE__EMAIL_NOT_FOUND        = 205;
export const PARSE_ERROR_CODE__INVALID_SESSION_TOKEN  = 209;


export const CLOUD_ERROR_CODE__STRIPE_INIT_ERROR   = 701;



const TIME_A = 7 * 1000;
const TIME_B = 30 * 1000;

let timer = 0;
let requests = [];


function logRequest (time) {
  if (!timer)
    timer = setInterval(timerTick, 1000);
  requests.push(time);
}

function logResponse (time) {
  requests.splice(requests.indexOf(time), 1);
  if (!requests.length) {
    clearInterval(timer);
    timer = 0;

    const {serverProblemA, serverProblemB} = store.getState().nav;
    if (serverProblemA)
      store.dispatch(setServerProblemA(false));
    if (serverProblemB)
      store.dispatch(setServerProblemB(false));
  }
}

function timerTick () {
  const delta = Date.now() - requests[0];

  if (delta > TIME_B) {
    clearInterval(timer);
    store.dispatch(setServerProblemB());
  } else if (delta > TIME_A) {
    store.dispatch(setServerProblemA());
  }
}


export function halt () {
  // halt! cleaning local storage and reloading page
  localStorage.clear();
  window.location = "/";
}

export async function send (req) {
  const time = Date.now();
  logRequest(time);

  try {
    let result = await req;
    logResponse(time);
    return result;
  
  } catch (error) {
    if (error.code == PARSE_ERROR_CODE__INVALID_SESSION_TOKEN)
      halt();

    if (error.code == PARSE_ERROR_CODE__CONNECTION_FAILED) {
      clearInterval(timer);
      store.dispatch(setServerProblemB());
    } else {
      logResponse(time);
    }
    
    throw error;
  }
}

export function getAllObjects (query) {
  const MAX_COUNT = 90;
  let objects = [];
  
  const getObjects = async (offset = 0) => {
    const res = await query
      .limit(MAX_COUNT)
      .skip(offset)
      .find();
    
    if (!res.length)
      return objects;
      
    objects = objects.concat(res);
    return getObjects(offset + MAX_COUNT);
  };
  
  return getObjects();
}
