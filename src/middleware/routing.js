import {browserHistory} from 'react-router';
import {LOCATION_CHANGE} from 'react-router-redux';

import {LOGIN_RESPONSE, REGISTER_RESPONSE, LOGOUT} from 'ducks/user';
import {setCurrentSite} from 'ducks/models';
import {getSiteByNameId} from 'utils/data';
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
      
    } else if (cSite) {
      browserHistory.replace(`${USERSPACE_URL}${SITE_URL}${cSite.nameId}`);
      
    } else {
      let sites = store.getState().models.sites;
      if (sites.length)
        browserHistory.replace(`${USERSPACE_URL}${SITE_URL}${sites[0].nameId}`);
    }
  };
  
  
  if (action.type == LOCATION_CHANGE) {
    URL = action.payload.pathname;
    let authorized = store.getState().user.authorized;
    let lsReady = store.getState().user.localStorageReady;
    
    if (URL.indexOf(USERSPACE_URL) != -1 && !authorized && lsReady)
      browserHistory.push(SIGN_URL);
  
    if (URL.indexOf(USERSPACE_URL) == -1 && authorized)
      browserHistory.push(USERSPACE_URL);
    
    if (store.getState().nav.initEnded)
      setFromURL();
  }
  
  if (action.type == INIT_END)
    setFromURL();
  
  if (action.type == REGISTER_RESPONSE || action.type == LOGIN_RESPONSE) {
    if (action.authorized) {
      if (URL.indexOf(USERSPACE_URL) == -1)
        browserHistory.replace('/');
    } else {
      browserHistory.push(SIGN_URL);
    }
  }
  
  if (action.type == LOGOUT)
    browserHistory.push(SIGN_URL);
  
  
  next(action);
};
