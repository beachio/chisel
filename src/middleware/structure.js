import {store} from '../index';
import {INIT_END as INIT_END_models, SITE_ADD, SET_CURRENT_MODEL, COLLABORATION_ADD, COLLABORATION_UPDATE, COLLABORATION_DELETE, MODEL_ADD, MODEL_DELETED, setCurrentSite} from 'ducks/models';
import {SET_CURRENT_ITEM, ITEM_ADD, deleteItem} from 'ducks/content';
import {openModel, openContentItem} from 'ducks/nav';
import {collaborationAdd, collaborationUpdate, collaborationDelete, modelAdd, contentAdd} from 'ducks/ACLset';


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
  if (action.type == COLLABORATION_ADD && !action.error)
    next(collaborationAdd(action.collab));
  if (action.type == COLLABORATION_UPDATE && !action.error)
    next(collaborationUpdate(action.collab));
  if (action.type == COLLABORATION_DELETE && !action.error)
    next(collaborationDelete(action.collab));
  if (action.type == MODEL_ADD && !action.error)
    next(modelAdd(action.model));
  
  //delete items after deleting model
  if (action.type == MODEL_DELETED && !action.error) {
    for (let item of store.getState().content.items) {
      if (item.model == action.model)
        next(deleteItem(item));
    }
  }
  
};
