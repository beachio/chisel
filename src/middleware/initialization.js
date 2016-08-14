import {LOGIN_RESPONSE, REGISTER_RESPONSE, LOCAL_STORAGE_RESPONSE} from '../ducks/user';
import {INIT_END as SITES_INIT_END} from '../ducks/sites';
import {initUser} from '../ducks/initialize';
import {init as initSites} from '../ducks/sites';
import {init as initModels} from '../ducks/models';


export const initialization = store => next => action => {
  next(action);

  if ((action.type == REGISTER_RESPONSE || action.type == LOGIN_RESPONSE || LOCAL_STORAGE_RESPONSE) &&
      action.authorized) {
    next(initUser());
    next(initSites());
  }
  
  if (action.type == SITES_INIT_END)
    next(initModels());
};
