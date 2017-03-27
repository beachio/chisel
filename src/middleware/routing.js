import {push, replace, LOCATION_CHANGE} from 'react-router-redux';

import {store} from '../index';
import {LOGIN_RESPONSE, REGISTER_RESPONSE, LOGOUT} from 'ducks/user';
import {setCurrentSite, setCurrentModel} from 'ducks/models';
import {setCurrentItem} from 'ducks/content';
import {getSiteByNameId, getModelByNameId, getContentByModelAndId} from 'utils/data';
import {INIT_END} from 'ducks/nav';


export const SIGN_URL = '/sign';
export const USERSPACE_URL = '/userspace';
export const SITE_URL = '/site~';
export const MODELS_URL = '/models';
export const MODEL_URL = '/model~';
export const CONTENT_URL = '/content';
export const ITEM_URL = '/item~';


let URL = '/';


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
  
  let setFromURL = () => {
    let path = URL;
    URL = '/';
    
    if (path.indexOf(USERSPACE_URL) == -1)
      return;
    
    //set current site
    let nameId = getNameId(path, SITE_URL);
    let cSite = store.getState().models.currentSite;
    if (nameId) {
      if (!cSite || nameId != cSite.nameId) {
        let site = getSiteByNameId(nameId);
        if (site)
          next(setCurrentSite(site));
      }
      
    } else {
      if (cSite) {
        next(replace(`${USERSPACE_URL}${SITE_URL}${cSite.nameId}`));
      } else {
        let sites = store.getState().models.sites;
        if (sites.length)
          next(replace(`${USERSPACE_URL}${SITE_URL}${sites[0].nameId}`));
      }
    }
  
    //set current model
    nameId = getNameId(path, MODEL_URL);
    let cModel = store.getState().models.currentModel;
    if (nameId && (!cModel || nameId != cModel.nameId)) {
      let model = getModelByNameId(nameId);
      if (model)
        next(setCurrentModel(model));
    }
  
    //set current content item
    nameId = getNameId(path, ITEM_URL);
    if (nameId) {
      let modelNameId = nameId.slice(0, nameId.indexOf('~'));
      let itemId = nameId.slice(nameId.indexOf('~') + 1);
      if (modelNameId && itemId) {
        let cItem = store.getState().content.currentItem;
        let isTemp = itemId.indexOf('(temp)') != -1;
        
        if (!cItem) {
          let item = getContentByModelAndId(modelNameId, itemId);
          if (item)
            next(setCurrentItem(item));
        } else {
          if (modelNameId != cItem.model.nameId ||
              isTemp ? itemId != cItem.tempId : itemId != cItem.origin.id) {
            let item = getContentByModelAndId(modelNameId, itemId);
            if (item)
              next(setCurrentItem(item));
          }
        }
      }
    }
    
  };
  
  
  if (action.type == LOCATION_CHANGE) {
    URL = action.payload.pathname;
    let authorized = store.getState().user.authorized;
    let lsReady = store.getState().user.localStorageReady;
    
    if (URL.indexOf(USERSPACE_URL) != -1 && !authorized && lsReady)
      next(push(SIGN_URL));
  
    if (URL.indexOf(USERSPACE_URL) == -1 && authorized)
      next(push(USERSPACE_URL));
    
    if (store.getState().nav.initEnded)
      setFromURL();
  }
  
  if (action.type == INIT_END)
    setFromURL();
  
  if (action.type == REGISTER_RESPONSE || action.type == LOGIN_RESPONSE) {
    if (action.authorized) {
      if (URL.indexOf(USERSPACE_URL) == -1)
        next(push('/'));
    } else {
      next(push(SIGN_URL));
    }
  }
  
  if (action.type == LOGOUT)
    next(push(SIGN_URL));
};
