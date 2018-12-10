import {store} from 'index';
import {logRequest, logResponse, setProblemB} from "ducks/serverStatus";


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
    if (error.code == 209)
      halt();

    if (error.code == 100)
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
