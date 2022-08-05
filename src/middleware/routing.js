import {LOGIN_RESPONSE, REGISTER_RESPONSE, LOGOUT} from 'ducks/user';
import {setCurrentSite, SITE_ADD, SITE_DELETE} from 'ducks/models';
import {getSiteByNameId} from 'utils/data';
import {
  INIT_END,
  URL_SIGN,
  URL_SITE,
  URL_USERSPACE,
  URL_MODELS,
  URLS_EMAIL,
  URL_EMAIL_VERIFY,
  URL_INVALID_LINK,
  URL_PROFILE,
  URL_PAY_PLANS,
  URL_PAYMENT_METHODS,
  LOCATION_CHANGE,
  RETURN_HOME
} from 'ducks/nav';


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

export const routing = store => next => action => {
  //TODO: костыль!
  const {navigate} = store.getState().nav;

  if ((action.type == REGISTER_RESPONSE || action.type == LOGIN_RESPONSE) &&
      !action.authorized && !isEmailURL(URL) && URL.indexOf(URL_SIGN) == -1)
    navigate(`/${URL_SIGN}`);

  next(action);

  const setFromURL = () => {
    let path = URL;
    URL = '/';

    if (path.indexOf(URL_USERSPACE) == -1)
      return;

    let cSite = store.getState().models.currentSite;
    let setDefaultSite = () => {
      if (cSite) {
        navigate(`/${URL_USERSPACE}/${URL_SITE}${cSite.nameId}`, {replace: true});
      } else {
        let sites = store.getState().models.sites;
        if (sites.length)
          navigate(`/${URL_USERSPACE}/${URL_SITE}${sites[0].nameId}`, {replace: true});
        else if (path != `/${URL_USERSPACE}`)
          navigate(`/${URL_USERSPACE}`, {replace: true});
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

    } else if (path.indexOf(URL_PROFILE) == -1 &&
               path.indexOf(URL_PAY_PLANS) == -1 &&
               path.indexOf(URL_PAYMENT_METHODS) == -1) {
      setDefaultSite();
    }
  }


  switch (action.type) {
    case LOCATION_CHANGE:
      URL = action.location.pathname;

      if (URL.indexOf(URL_USERSPACE) != -1 && !returnURL)
        returnURL = URL;

      if (store.getState().nav.initEnded)
        setFromURL();

      break;

    case INIT_END:
      if (returnURL) {
        URL = returnURL;
        returnURL = null;
        navigate(URL, {replace: true});

      } else if (
          URL.indexOf(URL_USERSPACE) == -1 &&
          URL.indexOf(URL_EMAIL_VERIFY) == -1 &&
          URL.indexOf(URL_INVALID_LINK) == -1) {
        navigate(`/${URL_USERSPACE}`, {replace: true});
      }

      setFromURL();

      break;

    case SITE_ADD:
      if (!action.fromServer)
        navigate(`/${URL_USERSPACE}/${URL_SITE}${action.site.nameId}`);
      break;

    case SITE_DELETE:
    case RETURN_HOME:
      navigate(`/${URL_USERSPACE}`);
      break;

    case LOGOUT:
      navigate(`/${URL_SIGN}`);
      break;
  }
};
