import {store} from 'index';
import {logRequest, logResponse} from "ducks/serverStatus";
import {promisify} from 'utils/common';


export function send (req) {
  let time = Date.now();
  store.dispatch(logRequest(time));

  return promisify(req)
    .then(
      res => {
        store.dispatch(logResponse(time));
        return res;
      }
    )
    .catch(
      error => {
        console.log(error);

        if (error.code != 100)
          store.dispatch(logResponse(time));

        return Promise.reject(error);
      }
    );
}