import {store} from 'index';
import {logRequest, logResponse, setProblemB} from "ducks/serverStatus";


export const PARSE_ERROR_CODE__CONNECTION_FAILED      = 100;
export const PARSE_ERROR_CODE__OBJECT_NOT_FOUND       = 101;
export const PARSE_ERROR_CODE__CLOUD_FAIL             = 141;
export const PARSE_ERROR_CODE__USERNAME_TAKEN         = 202;
export const PARSE_ERROR_CODE__EMAIL_TAKEN            = 203;
export const PARSE_ERROR_CODE__EMAIL_NOT_FOUND        = 205;
export const PARSE_ERROR_CODE__INVALID_SESSION_TOKEN  = 209;


export const CLOUD_ERROR_CODE__STRIPE_IS_NOT_INITED   = 701;


export function halt () {
  // halt! cleaning local storage and reload page
  localStorage.clear();
  window.location = "/";
}

export async function send (req) {
  const time = Date.now();
  store.dispatch(logRequest(time));

  try {
    let result = await req;
    store.dispatch(logResponse(time));
    return result;
  
  } catch (error) {
    if (error.code == PARSE_ERROR_CODE__INVALID_SESSION_TOKEN)
      halt();

    if (error.code == PARSE_ERROR_CODE__CONNECTION_FAILED)
      store.dispatch(setProblemB());
    else
      store.dispatch(logResponse(time));
    
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
