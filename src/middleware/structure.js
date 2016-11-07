import {INIT_END as INIT_END_models, SITE_ADD, SET_CURRENT_MODEL, setCurrentSite} from 'ducks/models';
import {SET_CURRENT_ITEM} from 'ducks/content';
import {openModel, openContentItem} from 'ducks/nav';


export const structure = store => next => action => {
  next(action);
  
  if (action.type == INIT_END_models && action.sites.length)
    next(setCurrentSite(action.sites[0]));
  
  if (action.type == SITE_ADD)
    next(setCurrentSite(action.site));
  
  if (action.type == SET_CURRENT_MODEL)
    next(openModel());
  
  if (action.type == SET_CURRENT_ITEM)
    next(openContentItem());
};
