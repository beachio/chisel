import {store} from 'index';
import {logRequest, logResponse} from "ducks/serverStatus";

export function sendRequest (req, ...args) {
  let time = Date.now();
  store.dispatch(logRequest(time));

  return req(...args)
    .then(
      () => store.dispatch(logResponse(time)),

      error => {
        if (error.code == 100)
          return;

        console.log(error);
        store.dispatch(logResponse(time));
      });
}