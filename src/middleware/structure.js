import {INIT_END as INIT_END_models, SITE_ADD, SET_CURRENT_MODEL, setCurrentSite} from 'ducks/models';
import {openModel} from 'ducks/nav';


export const structure = store => next => action => {
  next(action);
  
  if (action.type == INIT_END_models) {
    let currentSite = action.sites.length ? action.sites[0] : null;
    next(setCurrentSite(currentSite));
  }
  
  if (action.type == SITE_ADD)
    next(setCurrentSite(action.site));
  
  if (action.type == SET_CURRENT_MODEL)
    next(openModel());
};
