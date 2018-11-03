import {store} from 'index';
import {logRequest, logResponse, setProblemB} from "ducks/serverStatus";


export function halt () {
  // halt! cleaning local storage and reload page
  localStorage.clear();
  window.location = "/";
}

export function send (req) {
  const time = Date.now();
  store.dispatch(logRequest(time));

  return req

    .then(res => {
      store.dispatch(logResponse(time));
      return res;
    })

    .catch(error => {
      if (error.code == 209)
        halt();

      if (error.code == 100)
        store.dispatch(setProblemB());
      else
        store.dispatch(logResponse(time));

      throw error;
    });
}