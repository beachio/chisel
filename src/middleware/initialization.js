import {LOGIN_RESPONSE, REGISTER_RESPONSE, LOCAL_STORAGE_RESPONSE} from 'ducks/user';
import {init as initModels, INIT_END as INIT_MODELS_END} from 'ducks/models';
import {init as initContent} from 'ducks/content';


export const initialization = store => next => action => {
  next(action);

  if ((action.type == REGISTER_RESPONSE || action.type == LOGIN_RESPONSE || LOCAL_STORAGE_RESPONSE) &&
      action.authorized) {
    next(initModels());
  }
  
  if (action.type == INIT_MODELS_END)
    next(initContent());
};
