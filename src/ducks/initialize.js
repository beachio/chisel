import {Parse} from 'parse';

import {store} from '../index';
import {SiteData} from '../models/SiteData';
import {getLocalStorage} from '../ducks/user';


export const INITIALIZE_APP_START   = 'app/initialize/INITIALIZE_APP_START';
export const INITIALIZE_APP_END     = 'app/initialize/INITIALIZE_APP_END';
export const INITIALIZE_USER_START  = 'app/initialize/INITIALIZE_USER_START';
export const INITIALIZE_USER_END    = 'app/initialize/INITIALIZE_USER_END';

const ENDPOINT = "https://parse.nuwe.co:49178/parse";
const APP_ID = "d5701a37cf242d5ee398005d997e4229";
const CLIENT_KEY = "2b868e90b0af18609993e4575628784d";


function subInitParse() {
  Parse.initialize(APP_ID, CLIENT_KEY);
  Parse.serverURL = ENDPOINT;
}

export function initApp() {
  subInitParse();
  store.dispatch(getLocalStorage());
  return {
    type: INITIALIZE_APP_END
  };
}


function subInitSites() {
  let Site = Parse.Object.extend("Site");

  return new Promise((resolve, reject) => {
    new Parse.Query(Site)
      .find()
      .then(sites => {
        let result = {
          sitesAll: [],
          sitesUser: [],
          sitesAll_r: [],
          sitesUser_r: []
        };

        for (let site_r of sites) {
          result.sitesAll_r.push(site_r);
          let site = new SiteData().setFromServer(site_r);
          result.sitesAll.push(site);

          if (site_r.get('owner') == Parse.User.current()) {
            result.sitesUser_r.push(site_r);
            result.sitesUser.push(site);
          }
        }

        resolve(result);
      }, () => reject());
  });
}

export function initUser() {
  return dispatch => {
    dispatch({
      type: INITIALIZE_USER_START
    });

    let sites;

    subInitSites()
      .then(_sites => {
        sites = _sites;

        dispatch({
          ...sites,
          type: INITIALIZE_USER_END
        });
      });
  };
}

const initialState = {
  initializedApp: false,

  initializedUser: false,

  sitesAll: [],
  sitesUser: [],
  sitesAll_r: [],
  sitesUser_r: []
};

export default function initializeReducer(state = initialState, action) {
  switch (action.type) {
    case INITIALIZE_APP_START:
      return state;

    case INITIALIZE_APP_END:
      return {...state, initializedApp: true};

    case INITIALIZE_USER_START:
      return state;

    case INITIALIZE_USER_END:
      return {
        ...state,

        sitesAll:     action.sitesAll,
        sitesUser:    action.sitesUser,
        sitesAll_r:   action.sitesAll_r,
        sitesUser_r:  action.sitesUser_r,

        initializedUser: true
      };

    default:
      return state;
  }
}
