import {INIT_END as INIT_END_models, SITE_ADD, SET_CURRENT_MODEL, COLLABORATION_ADD, COLLABORATION_UPDATE, COLLABORATION_DELETE, MODEL_ADD, setCurrentSite} from 'ducks/models';
import {SET_CURRENT_ITEM} from 'ducks/content';
import {openModel, openContentItem} from 'ducks/nav';
import {collaborationAdd, collaborationUpdate, collaborationDelete, modelAdd} from 'ducks/ACLset';


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
  
  
  // set ACLs
  if (action.type == COLLABORATION_ADD)
    next(collaborationAdd(action.collab));
  if (action.type == COLLABORATION_UPDATE)
    next(collaborationUpdate(action.collab));
  if (action.type == COLLABORATION_DELETE)
    next(collaborationDelete(action.collab));
  if (action.type == MODEL_ADD)
    next(modelAdd(action.model));
};
