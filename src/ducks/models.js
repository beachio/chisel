import {Parse} from 'parse';

import {store} from '../index';
import {UserData, CollaborationData, ROLE_ADMIN, ROLE_DEVELOPER, ROLE_EDITOR, ROLE_OWNER} from 'models/UserData';
import {SiteData, ModelData, ModelFieldData, canBeTitle} from 'models/ModelData';
import {getRandomColor} from 'utils/common';
import {LOGOUT} from './user';
import {deleteItem} from './content'


export const INIT_END             = 'app/models/INIT_END';

export const SITE_ADD             = 'app/models/SITE_ADD';
export const SITE_UPDATED         = 'app/models/SITE_UPDATED';
export const SITE_DELETED         = 'app/models/SITE_DELETED';
export const COLLABORATION_ADD    = 'app/models/COLLABORATION_ADD';
export const COLLABORATION_UPDATE = 'app/models/COLLABORATION_UPDATE';
export const COLLABORATION_DELETE = 'app/models/COLLABORATION_DELETE';
export const MODEL_ADD            = 'app/models/MODEL_ADD';
export const MODEL_UPDATED        = 'app/models/MODEL_UPDATED';
export const MODEL_DELETED        = 'app/models/MODEL_DELETED';
export const FIELD_ADD            = 'app/models/FIELD_ADD';
export const FIELD_UPDATED        = 'app/models/FIELD_UPDATED';
export const FIELD_DELETED        = 'app/models/FIELD_DELETED';

export const SET_CURRENT_SITE     = 'app/models/SET_CURRENT_SITE';
export const SET_CURRENT_MODEL    = 'app/models/SET_CURRENT_MODEL';


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

        Parse.Object.fetchAllIfNeeded(sites)
          .then(() => resolve(sites), reject);
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
        let promises = [];
        for (let collab_o of collabs_o) {
          let collab = new CollaborationData().setOrigin(collab_o);
          
          promises.push(new Promise((inResolve, inReject) => {
            collab_o.get('user')
              .fetch()
              .then(user_o => {
                let user = new UserData().setOrigin(user_o);
                collab.user = user;
                inResolve();
              }, inReject);
          }));
          
          let site_o = collab_o.get("site");
          for (let site of sites) {
            if (site.origin.id == site_o.id) {
              collab.site = site;
              site.collaborations.push(collab);
              break;
            }
          }
        }
  
        Promise.all(promises)
          .then(() => resolve())
          .catch(reject);
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
        let promises = [];
        for (let site_o of sites_o) {
          let site = new SiteData().setOrigin(site_o);
  
          promises.push(new Promise((inResolve, inReject) => {
            site_o.get('owner')
              .fetch()
              .then(owner_o => {
                let owner = new UserData().setOrigin(owner_o);
                site.owner = owner;
                inResolve();
              }, inReject);
          }));
          
          sites.push(site);
        }

        return Promise.all(promises)
          .then(() => Promise.all([
            requestCollaborationsPost(sites_o, sites),
            requestModels(sites_o, sites, models_o, models)
              .then(() => requestFields(models_o, models))
          ]));
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
  if (!currentSite)
    return {
      type: SET_CURRENT_SITE,
      currentSite: null
    };
  
  let userData = store.getState().user.userData;

  let getRole = () => {
    if (userData.origin.id == currentSite.owner.origin.id)
      return ROLE_OWNER;
    for (let collab of currentSite.collaborations) {
      if (collab.user.origin.id == userData.origin.id)
        return collab.role;
    }
    return null;
  };
  let role = getRole();

  return {
    type: SET_CURRENT_SITE,
    currentSite,
    role
  };
}

export function addSite(site) {
  let sites = store.getState().models.sites;
  sites.push(site);
  
  site.owner = store.getState().user.userData;
  site.updateOrigin();
  
  site.origin.setACL(new Parse.ACL(Parse.User.current()));
  site.origin.save();
  
  return {
    type: SITE_ADD,
    site,
    sites
  };
}

export function updateSite(site) {
  site.updateOrigin();
  site.origin.save();
  
  return {
    type: SITE_UPDATED
  };
}

export function deleteSite(site) {
  let sites = store.getState().models.sites;
  sites.splice(sites.indexOf(site), 1);
  
  site.origin.destroy();
  
  store.dispatch(setCurrentSite(sites[0]));
  
  return {
    type: SITE_DELETED
  };
}

export function addCollaboration(user) {
  return dispatch => {
    let collab = new CollaborationData();
    collab.user = user;
  
    let currentSite = store.getState().models.currentSite;
    collab.site = currentSite;
  
    currentSite.collaborations.push(collab);
    collab.updateOrigin();
    collab.origin.save()
      .then(() => dispatch({
        type: COLLABORATION_ADD,
        collab
      }), error => dispatch({
        type: COLLABORATION_ADD,
        error
      }));
  };
}

export function updateCollaboration(collab) {
  return dispatch => {
    collab.updateOrigin();
  
    collab.origin.save()
      .then(() => dispatch({
        type: COLLABORATION_UPDATE,
        collab
      }), error => dispatch({
        type: COLLABORATION_UPDATE,
        error
      }));
  }
}

export function deleteCollaboration(collab) {
  return dispatch => {
    let collabs = store.getState().models.currentSite.collaborations;
    collabs.splice(collabs.indexOf(collab), 1);
  
    collab.origin.destroy()
      .then(() => dispatch({
        type: COLLABORATION_DELETE,
        collab
      }), error => dispatch({
        type: COLLABORATION_DELETE,
        error
      }));
  }
}

export function addModel(name) {
  return dispatch => {
    let model = new ModelData();
    model.name = name;
    model.color = getRandomColor();
  
    let currentSite = store.getState().models.currentSite;
    currentSite.models.push(model);
    model.site = currentSite;
  
    model.setTableName();
    model.updateOrigin();
  
    model.origin.save()
      .then(() => dispatch({
        type: MODEL_ADD,
        model
      }), error => dispatch({
        type: MODEL_ADD,
        error
      }));
  }
}

export function updateModel(model) {
  return dispatch => {
    model.updateOrigin();
    model.origin.save()
      .then(() => dispatch({
        type: MODEL_UPDATED,
        model
      }), error => dispatch({
        type: MODEL_UPDATED,
        error
      }));
  }
}

export function setCurrentModel(currentModel) {
  return {
    type: SET_CURRENT_MODEL,
    currentModel
  };
}

export function deleteModel(model) {
  return dispatch => {
    let models = store.getState().models.currentSite.models;
    models.splice(models.indexOf(model), 1);
  
    model.origin.destroy()
      .then(() => dispatch({
        type: MODEL_DELETED,
        model
      }), error => dispatch({
        type: MODEL_DELETED,
        error
      }));
  }
}

function changeTitleField(field, value = true) {
  field.isTitle = value;
  field.updateOrigin();
  return new Promise((rs, rj) => field.origin.save().then(rs, rj));
}

export function addField(name) {
  return dispatch => {
    let field = new ModelFieldData();
    field.name = name;
    field.color = getRandomColor();
  
    let currentModel = store.getState().models.currentModel;
    currentModel.fields.push(field);
    field.model = currentModel;
  
    field.updateOrigin();
    new Promise((rs, rj) => field.origin.save().then(rs, rj))
      .then(() => {
        if (!currentModel.hasTitle() && canBeTitle(field))
          return changeTitleField(field);
      })
      .then(() => new Promise((rs, rj) => field.model.origin.save().then(rs, rj)))
      .then(() => dispatch({
        type: FIELD_ADD,
        field
      }))
      .catch(error => dispatch({
        type: FIELD_ADD,
        error
      }));
  }
}

export function updateField(field) {
  return dispatch => {
    field.updateOrigin();
    new Promise((rs, rj) => field.origin.save().then(rs, rj))
      .then(() => {
        if (field.isTitle) {
          //if current field is title, remove other titles
          if (canBeTitle(field)) {
            let promises = [];
            for (let tempField of field.model.fields) {
              if (tempField != field && tempField.isTitle)
                promises.push(changeTitleField(tempField, false));
            }
            return Promise.all(promises);
          } else {
            return changeTitleField(field, false);
          }
        }
  
        if (!field.model.hasTitle()) {
          //first we check other fields to make title
          for (let tempField of field.model.fields) {
            if (tempField != field && canBeTitle(tempField))
              return changeTitleField(tempField);
          }
          
          //if we can't, we try to make title current field
          if (canBeTitle(field))
            return changeTitleField(field);
        }
      })
      .then(() => new Promise((rs, rj) => field.model.origin.save().then(rs, rj)))
      .then(() => dispatch ({
        type: FIELD_UPDATED,
        field
      }))
      .catch(error => dispatch({
        type: FIELD_UPDATED,
        error
      }));
  }
}

export function removeField(field) {
  return dispatch => {
    let fields = store.getState().models.currentModel.fields;
    fields.splice(fields.indexOf(field), 1);
  
    new Promise((rs, rj) => field.origin.destroy().then(rs, rj))
      .then(() => {
        if (!field.model.hasTitle()) {
          for (let tempField of field.model.fields) {
            if (canBeTitle(tempField))
              return changeTitleField(tempField);
          }
        }
      })
      .then(() => new Promise((rs, rj) => field.model.origin.save().then(rs, rj)))
      .then(() => dispatch ({
        type: FIELD_DELETED,
        field
      }))
      .catch(error => dispatch ({
        type: FIELD_DELETED,
        error
      }));
  }
}

const initialState = {
  sites: [],
  currentSite: null,
  currentModel: null,

  role: null
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
        role: action.role
      };

    case SET_CURRENT_MODEL:
      return {
        ...state,
        currentModel: action.currentModel
      };
  
    case SITE_UPDATED:
    case SITE_DELETED:
    case COLLABORATION_ADD:
    case COLLABORATION_UPDATE:
    case COLLABORATION_DELETE:
    case MODEL_ADD:
    case MODEL_UPDATED:
    case MODEL_DELETED:
    case FIELD_ADD:
    case FIELD_UPDATED:
    case FIELD_DELETED:
      return {...state};
    
    case LOGOUT:
      return {
        ...state,
        currentModel: null,
        currentSite: null,
        role: null
      };
    
    default:
      return state;
  }
}