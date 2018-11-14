import {LOGIN_RESPONSE, REGISTER_RESPONSE, LOGOUT} from 'ducks/user';
import {init as init_models,    INIT_END as INIT_END_models}    from 'ducks/models';
import {init as init_media,     INIT_END as INIT_END_media}     from 'ducks/media';
import {init as init_content,   INIT_END as INIT_END_content}   from 'ducks/content';
import {initEnd, setCurrentPage, PAGE_MODELS} from 'ducks/nav';


export const initialization = store => next => action => {
  next(action);

  if ((action.type == REGISTER_RESPONSE || action.type == LOGIN_RESPONSE) &&
      action.authorized) {
    next(init_models());
  }
  
  if (action.type == INIT_END_models)
    next(init_media());
  
  if (action.type == INIT_END_media)
    next(init_content());
  
  if (action.type == INIT_END_content)
    next(initEnd());
  
  
  
  //logout
  if (action.type == LOGOUT)
    next(setCurrentPage(PAGE_MODELS));
};
