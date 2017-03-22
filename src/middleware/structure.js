import {INIT_END as INIT_END_models, SITE_ADD, setCurrentSite} from 'ducks/models';


export const structure = store => next => action => {
  next(action);
  
  if (action.type == INIT_END_models && action.sites.length)
    next(setCurrentSite(action.sites[0]));
  
  if (action.type == SITE_ADD)
    next(setCurrentSite(action.site));
};
