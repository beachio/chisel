import {LOGIN_RESPONSE, REGISTER_RESPONSE, LOCAL_STORAGE_RESPONSE} from '../ducks/user';
import {initUser} from '../ducks/initialize';
import {init as initSites} from '../ducks/sites';


export const initialization = store => next => action => {
  next(action);

  if ((action.type == REGISTER_RESPONSE || action.type == LOGIN_RESPONSE || LOCAL_STORAGE_RESPONSE) &&
      action.authorized) {
    next(initUser());
    next(initSites());
  }
};
