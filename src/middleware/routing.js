import {browserHistory} from 'react-router';
import {LOCATION_CHANGE} from 'react-router-redux';

import {LOGIN_RESPONSE, REGISTER_RESPONSE, LOGOUT} from 'ducks/user';
import {setCurrentSite, SITE_ADD} from 'ducks/models';
import {getSiteByNameId} from 'utils/data';
import {INIT_END, URL_SIGN, URL_SITE, URL_USERSPACE, URLS_EMAIL, URL_EMAIL_VERIFY, URL_INVALID_LINK, URL_PROFILE, URL_PAY_PLANS} from 'ducks/nav';


let URL = '/';
let returnURL = null;


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

let isEmailURL = URL => {
  for (let eURL of URLS_EMAIL) {
    if (URL.indexOf(eURL) != -1)
      return true;
  }
  return false;
};

export const routing = store => next => action => {
  if ((action.type == REGISTER_RESPONSE || action.type == LOGIN_RESPONSE) &&
      !action.authorized && !isEmailURL(URL) && URL.indexOf(URL_SIGN) == -1)
    browserHistory.push(`/${URL_SIGN}`);
  
  next(action);
  
  const setFromURL = () => {
    let path = URL;
    URL = '/';
    
    if (path.indexOf(URL_USERSPACE) == -1)
      return;
  
    let cSite = store.getState().models.currentSite;
    let setDefaultSite = () => {
      if (cSite) {
        browserHistory.replace(`/${URL_USERSPACE}/${URL_SITE}${cSite.nameId}`);
      } else {
        let sites = store.getState().models.sites;
        if (sites.length)
          browserHistory.replace(`/${URL_USERSPACE}/${URL_SITE}${sites[0].nameId}`);
        else if (path != `/${URL_USERSPACE}`)
          browserHistory.replace(`/${URL_USERSPACE}`);
      }
    };
    
    //set current site
    let nameId = getNameId(path, URL_SITE);
    if (nameId) {
      if (!cSite || nameId != cSite.nameId) {
        let site = getSiteByNameId(nameId);
        if (site)
          next(setCurrentSite(site));
        else
          setDefaultSite();
      }
      
    } else if (path.indexOf(URL_PROFILE) == -1 && path.indexOf(URL_PAY_PLANS) == -1) {
      setDefaultSite();
    }
  };
  
  
  switch (action.type) {
    case LOCATION_CHANGE:
      URL = action.payload.pathname;
      
      if (URL.indexOf(URL_USERSPACE) != -1 && !returnURL)
        returnURL = URL;
    
      if (store.getState().nav.initEnded)
        setFromURL();
      
      break;
  
    case INIT_END:
      if (returnURL) {
        URL = returnURL;
        returnURL = null;
        browserHistory.replace(URL);
        
      } else if (
          URL.indexOf(URL_USERSPACE) == -1 &&
          URL.indexOf(URL_EMAIL_VERIFY) == -1 &&
          URL.indexOf(URL_INVALID_LINK) == -1) {
        browserHistory.replace(`/${URL_USERSPACE}`);
      }
      
      setFromURL();
      
      break;
      
    case SITE_ADD:
      browserHistory.push(`/${URL_USERSPACE}/${URL_SITE}${action.site.nameId}`);
      break;
      
    case LOGOUT:
      browserHistory.push(`/${URL_SIGN}`);
      break;
  }
};
