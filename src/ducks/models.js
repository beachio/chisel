import {Parse} from 'parse';

import {store} from '../index';
import {UserData, CollaborationData, ROLE_ADMIN} from 'models/UserData';
import {SiteData, ModelData, ModelFieldData} from 'models/ModelData';


export const INIT_END           = 'app/models/INIT_END';

export const SITE_ADD           = 'app/models/SITE_ADD';
export const SITE_UPDATED       = 'app/models/SITE_UPDATED';
export const COLLABORATION_ADD  = 'app/models/COLLABORATION_ADD';
export const MODEL_ADD          = 'app/models/MODEL_ADD';
export const MODEL_UPDATED      = 'app/models/MODEL_UPDATED';
export const FIELD_ADD          = 'app/models/FIELD_ADD';
export const FIELD_UPDATED      = 'app/models/FIELD_UPDATED';
export const FIELD_DELETED      = 'app/models/FIELD_DELETED';

export const SET_CURRENT_SITE   = 'app/models/SET_CURRENT_SITE';
export const SET_CURRENT_MODEL  = 'app/models/SET_CURRENT_MODEL';


function requestCollaborationsPre() {
  return new Promise((resolve, reject) => {
    new Parse.Query(CollaborationData.OriginClass)
      .equalTo("user", Parse.User.current())
      .find()
      .then(collabs => {
        let sites = [];
        for (let collab of collabs) {
          sites.push(collab.get('site'));
        }
        
        resolve(sites);
      }, reject);
  });
}

function requestUserSites() {
  return new Promise((resolve, reject) => {
    new Parse.Query(SiteData.OriginClass)
      .equalTo("owner", Parse.User.current())
      .find()
      .then(resolve, reject);
  });
}

function requestCollaborationsPost(sites_o, sites) {
  return new Promise((resolve, reject) => {
    new Parse.Query(CollaborationData.OriginClass)
      .containedIn("site", sites_o)
      .find()
      .then(collabs_o => {
        for (let collab_o of collabs_o) {
          let collab = new CollaborationData().setOrigin(collab_o);
          
          //WARNING: uncontrolled async operations
          collab_o.get('user')
            .fetch()
            .then(user_o => {
              let user = new UserData().setOrigin(user_o);
              collab.user = user;
            });
          
          let site_o = collab_o.get("site");
          for (let site of sites) {
            if (site.origin.id == site_o.id) {
              collab.site = site;
              site.collaborations.push(collab);
              break;
            }
          }
        }
        
        resolve();
      }, reject);
  });
}

function requestModels(sites_o, sites, models_o, models) {
  return new Promise((resolve, reject) => {
    new Parse.Query(ModelData.OriginClass)
      .containedIn("site", sites_o)
      .find()
      .then(_models_o => {
        Array.prototype.push.apply(models_o, _models_o);
        
        for (let model_o of models_o) {
          let model = new ModelData().setOrigin(model_o);
          let site_o = model_o.get("site");
          for (let site of sites) {
            if (site.origin.id == site_o.id) {
              model.site = site;
              site.models.push(model);
              models.push(model);
              break;
            }
          }
        }
        
        resolve();
      }, reject);
  });
}

function requestFields(models_o, models) {
  return new Promise((resolve, reject) => {
    new Parse.Query(ModelFieldData.OriginClass)
      .containedIn("model", models_o)
      .find()
      .then(fields_o => {
        for (let field_o of fields_o) {
          let field = new ModelFieldData().setOrigin(field_o);
          let model_o = field_o.get("model");
          for (let model of models) {
            if (model.origin.id == model_o.id) {
              field.model = model;
              model.fields.push(field);
              break;
            }
          }
        }
        resolve();
      }, reject);
  });
}

export function init() {
  return dispatch => {
    let sites_o = [];
    let sites = [];
    
    let models_o = [];
    let models = [];
  
    requestCollaborationsPre()
      .then(sitesCollab_o => {
        sites_o = sitesCollab_o;
        return requestUserSites();
      })
      .then(sitesUser_o => {
        sites_o = sites_o.concat(sitesUser_o);
        
        for (let site_o of sites_o) {
          let site = new SiteData().setOrigin(site_o);
          
          //WARNING: uncontrolled async operations
          site_o.get('owner')
            .fetch()
            .then(owner_o => {
              let owner = new UserData().setOrigin(owner_o);
              site.owner = owner;
            });
          
          sites.push(site);
        }

        return Promise.all([
          requestCollaborationsPost(sitesUser_o, sites),
          requestModels(sites_o, sites, models_o, models)
            .then(() => requestFields(models_o, models))
        ]);
      })
      .then(() =>
        dispatch({
          type: INIT_END,
          sites
        })
      );
  }
}

export function setCurrentSite(currentSite) {
  let userData = store.getState().user.userData;
  let isOwner = userData.origin.id == currentSite.owner.origin.id;

  let checkIsAdmin = () => {
    for (let collab of currentSite.collaborations) {
      if (collab.user.origin.id == userData.origin.id && collab.role == ROLE_ADMIN)
        return true;
    }
    return false;
  };
  let isAdmin = checkIsAdmin();

  return {
    type: SET_CURRENT_SITE,
    currentSite,
    isOwner,
    isAdmin
  };
}

export function addSite(site) {
  let sites = store.getState().models.sites;
  sites.push(site);
  
  site.owner = store.getState().user.userData;
  site.updateOrigin();
  site.origin.save();
  
  return {
    type: SITE_ADD,
    site,
    sites
  };
}

export function updateSite(site) {
  let sites = store.getState().models.sites;
  for (let _site of sites) {
    if (site == _site) {
      site.updateOrigin();
      site.origin.save();
      break;
    }
  }
  return {
    type: SITE_UPDATED
  };
}

export function addCollaboration(collab) {
  let currentSite = store.getState().models.currentSite;
  currentSite.collaborations.push(collab);
  
  collab.site = currentSite;
  collab.updateOrigin();
  collab.origin.save();
  
  return {
    type: COLLABORATION_ADD
  };
}

export function addModel(model) {
  let currentSite = store.getState().models.currentSite;
  currentSite.models.push(model);

  model.site = currentSite;
  model.setTableName();
  model.updateOrigin();
  model.origin.save();
  
  return {
    type: MODEL_ADD,
    model
  };
}

export function updateModel(model) {
  model.updateOrigin();
  model.origin.save();
  
  return {
    type: MODEL_UPDATED
  };
}

export function setCurrentModel(currentModel) {
  return {
    type: SET_CURRENT_MODEL,
    currentModel
  };
}

export function addField(field) {
  let currentModel = store.getState().models.currentModel;
  currentModel.fields.push(field);

  field.model = currentModel;
  field.updateOrigin();
  field.origin.save();
  
  return {
    type: FIELD_ADD
  };
}

export function updateField(field) {
  field.updateOrigin();
  field.origin.save();
  
  return {
    type: FIELD_UPDATED
  };
}

export function removeField(field) {
  let fields = store.getState().models.currentModel.fields;
  fields.splice(fields.indexOf(field), 1);
  
  field.origin.destroy();
  
  return {
    type: FIELD_DELETED
  };
}

const initialState = {
  sites: [],
  currentSite: null,
  currentModel: null,

  isOwner: false,
  isAdmin: false
};

export default function modelsReducer(state = initialState, action) {
  switch (action.type) {
    case INIT_END:
    case SITE_ADD:
      return {
        ...state,
        sites: action.sites
      };
  
    case SET_CURRENT_SITE:
      return {
        ...state,
        currentSite:  action.currentSite,
        isOwner: action.isOwner,
        isAdmin: action.isAdmin
      };

    case SET_CURRENT_MODEL:
      return {
        ...state,
        currentModel: action.currentModel
      };
  
    case SITE_UPDATED:
    case COLLABORATION_ADD:
    case MODEL_ADD:
    case MODEL_UPDATED:
    case FIELD_ADD:
    case FIELD_UPDATED:
    case FIELD_DELETED:
      return state;
    
    default:
      return state;
  }
}