import React, {Component} from 'react';
import {
  useLocation,
  useNavigate,
  useParams
} from "react-router-dom";

import {
  setServerProblemB,
  URL_PAY_PLANS,
  URL_PAYMENT_METHODS,
  URL_PROFILE,
  URL_SITE,
  URL_USERSPACE,
  URLS_EMAIL
} from "ducks/nav";

import {store} from 'index';
import {getSiteByNameId} from "utils/data";
import {setCurrentSite} from "ducks/models";


export const getNameId = (path, type) => {
  let ind = path.indexOf(type);
  if (ind == -1)
    return null;

  let nameId = path.slice(ind).slice(type.length);
  let ind2 = nameId.indexOf('/');
  if (ind2 > 0)
    nameId = nameId.slice(0, ind2);
  return nameId;
};

export const isEmailURL = URL => {
  for (let eURL of URLS_EMAIL) {
    if (URL.indexOf(eURL) != -1)
      return true;
  }
  return false;
};

export const setDefaultSite = () => {
  return;

  const currentSite = store.getState().models.currentSite;
  if (currentSite) {
    history.replace(`/${URL_USERSPACE}/${URL_SITE}${currentSite.nameId}`);
  } else {
    let sites = store.getState().models.sites;
    if (sites.length)
      history.replace(`/${URL_USERSPACE}/${URL_SITE}${sites[0].nameId}`);
    else if (path != `/${URL_USERSPACE}`)
      history.replace(`/${URL_USERSPACE}`);
  }
}

export const setSiteFromNameId = nameId => {
  //let path = URL;
  //URL = '/';

  const currentSite = store.getState().models.currentSite;

  //set current site
  if (nameId) {
    if (!currentSite || nameId != currentSite.nameId) {
      let site = getSiteByNameId(nameId);
      if (site)
        store.dispatch(setCurrentSite(site));
      //else
        //setDefaultSite();
    }

  } /*else if (path.indexOf(URL_PROFILE) == -1 &&
    path.indexOf(URL_PAY_PLANS) == -1 &&
    path.indexOf(URL_PAYMENT_METHODS) == -1) {
    setDefaultSite();
  }*/
};

export function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    return (
      <Component
        {...props}
        router={{ location, navigate, params }}
      />
    );
  }

  return ComponentWithRouterProp;
}
