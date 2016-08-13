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
        let sitesAll_r = [];
        let sitesUser_r = [];

        for (let site_r of sites) {
          sitesAll_r.push(site_r);
          let site = new SiteData().setFromServer(site_r);
          sitesAll.push(site);

          if (site_r.get('owner').id == Parse.User.current().id) {
            sitesUser_r.push(site_r);
            sitesUser.push(site);
          }
        }

        let currentSite = sitesUser.length ? sitesUser[0] : null;

        dispatch({
          type: INIT_END,
          sitesAll,
          sitesUser,
          sitesAll_r,
          sitesUser_r,
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
  let sitesAll_r = store.getState().sites.sitesAll_r;
  let sitesUser_r = store.getState().sites.sitesUser_r;

  site.owner = Parse.User.current();

  sitesAll.push(site);
  sitesUser.push(site);

  let Site = Parse.Object.extend("Site");
  let site_r = new Site();
  site.updateRemote(site_r);

  sitesAll_r.push(site_r);
  sitesUser_r.push(site_r);

  site_r.save();

  return {
    type: SITE_ADD,
    sitesAll,
    sitesUser,
    sitesAll_r,
    sitesUser_r,
    currentSite: site
  };
}


const initialState = {
  sitesAll: [],
  sitesUser: [],
  sitesAll_r: [],
  sitesUser_r: [],

  currentSite: null
};

export default function sitesReducer(state = initialState, action) {
  switch (action.type) {
    case INIT_END:
    case SITE_ADD:
      return {
        ...state,

        sitesAll:     action.sitesAll,
        sitesUser:    action.sitesUser,
        sitesAll_r:   action.sitesAll_r,
        sitesUser_r:  action.sitesUser_r,

        currentSite:  action.currentSite
      };

    case SET_CURRENT_SITE:
      return {
        ...state,
        currentSite: action.currentSite
      };

    default:
      return state;
  }
}