import {Parse} from 'parse';

import {store} from '../index';
import {SiteData} from '../models/SiteData';

export const INIT_END         = 'app/sites/INIT_END';
export const SITE_ADD         = 'app/sites/SITE_ADD';
export const SET_CURRENT_SITE = 'app/sites/SET_CURRENT_SITE';


export function init() {
  return dispatch => {
    let Site = Parse.Object.extend("Site");
    new Parse.Query(Site)
      .find()
      .then(sites => {
        let sitesAll = [];
        let sitesUser = [];

        for (let site_o of sites) {
          let site = new SiteData().setOrigin(site_o);
          sitesAll.push(site);

          if (site_o.get('owner').id == Parse.User.current().id)
            sitesUser.push(site);
        }

        let currentSite = sitesUser.length ? sitesUser[0] : null;

        dispatch({
          type: INIT_END,
          sitesAll,
          sitesUser,
          currentSite
        });
      }, () => {})
  };
}

export function setCurrentSite(currentSite) {
  return {
    type: SET_CURRENT_SITE,
    currentSite
  };
}

export function addSite(site) {
  let sitesAll = store.getState().sites.sitesAll;
  let sitesUser = store.getState().sites.sitesUser;

  site.owner = Parse.User.current();

  sitesAll.push(site);
  sitesUser.push(site);

  site.updateOrigin();
  site.origin.save();

  return {
    type: SITE_ADD,
    sitesAll,
    sitesUser,
    currentSite: site
  };
}


const initialState = {
  sitesAll: [],
  sitesUser: [],

  currentSite: null
};

export default function sitesReducer(state = initialState, action) {
  switch (action.type) {
    case INIT_END:
    case SITE_ADD:
      return {
        ...state,
        sitesAll:       action.sitesAll,
        sitesUser:      action.sitesUser,
        currentSite:    action.currentSite
      };

    case SET_CURRENT_SITE:
      return {
        ...state,
        currentSite:    action.currentSite
      };

    default:
      return state;
  }
}