import {push} from 'react-router-redux';

import {store} from '../index';
import {LOGIN_RESPONSE, REGISTER_RESPONSE, LOGOUT} from 'ducks/user';
import {setCurrentSite, setCurrentModel} from 'ducks/models';
import {setCurrentItem} from 'ducks/content';
import {getSiteByNameId, getModelByNameId, getContentByModelAndId} from 'utils/data';


const LOCATION_CHANGE = '@@router/LOCATION_CHANGE';

export const SIGN_URL = '/sign';
export const USERSPACE_URL = '/userspace';
export const SITE_URL = '/site~';
export const MODELS_URL = '/models';
export const MODEL_URL = '/model~';
export const ITEM_URL = '/item~';


let getNameId = (path, type) => {
  let ind = path.indexOf(type);
  if (ind == -1)
    return null;
  
  let nameId = path.slice(ind).slice(type.length);
  let ind2 = nameId.indexOf('/');
  if (ind2 > 0)
    nameId = nameId.slice(0, ind2);
  return nameId;
};

export const routing = store => next => action => {
  next(action);
  
  if ((action.type == REGISTER_RESPONSE || action.type == LOGIN_RESPONSE) &&
    action.authorized) {
    next(push(USERSPACE_URL));
  }
  
  if (action.type == LOGOUT)
    next(push(SIGN_URL));
  
  if (action.type == LOCATION_CHANGE) {
    let path = action.payload.pathname;
    
    if (path.indexOf(USERSPACE_URL) != -1 && !store.getState().user.authorized)
      next(push(SIGN_URL));
  
    if (path.indexOf(USERSPACE_URL) == -1 && store.getState().user.authorized)
      next(push(USERSPACE_URL));
    
    if (path.indexOf(USERSPACE_URL) != -1) {
      let nameId = getNameId(path, SITE_URL);
      let cSite = store.getState().models.currentSite;
      if (nameId && (!cSite || nameId != cSite.nameId)) {
        let site = getSiteByNameId(nameId);
        if (site)
          next(setCurrentSite(site));
      }
  
      nameId = getNameId(path, MODEL_URL);
      let cModel = store.getState().models.currentModel;
      if (nameId && (!cModel || nameId != cModel.nameId)) {
        let model = getModelByNameId(nameId);
        if (model)
          next(setCurrentModel(model));
      }
  
      nameId = getNameId(path, ITEM_URL);
      if (nameId) {
        let modelNameId = nameId.slice(0, nameId.indexOf('~'));
        let itemId = nameId.slice(nameId.indexOf('~') + 1);
        if (modelNameId && itemId) {
          let cItem = store.getState().content.currentItem;
          if (!cItem || modelNameId != cItem.model.nameId || itemId != cItem.origin.id) {
            let item = getContentByModelAndId(nameId);
            if (item)
              next(setCurrentItem(item));
          }
        }
        
      }
    }
  }
};
