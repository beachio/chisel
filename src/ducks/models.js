import {Parse} from 'parse';

import {store} from '../index';
import {UserData, CollaborationData, ROLE_ADMIN, ROLE_DEVELOPER, ROLE_EDITOR, ROLE_OWNER} from 'models/UserData';
import {SiteData, ModelData, ModelFieldData, canBeTitle} from 'models/ModelData';
import {getRandomColor} from 'utils/common';
import {getNameId} from 'utils/data';
import {LOGOUT} from './user';


export const INIT_END                   = 'app/models/INIT_END';

export const SITE_ADD                   = 'app/models/SITE_ADD';
export const SITE_UPDATE                = 'app/models/SITE_UPDATE';
export const SITE_DELETE                = 'app/models/SITE_DELETE';
export const COLLABORATION_ADD          = 'app/models/COLLABORATION_ADD';
export const COLLABORATION_UPDATE       = 'app/models/COLLABORATION_UPDATE';
export const COLLABORATION_DELETE       = 'app/models/COLLABORATION_DELETE';
export const COLLABORATION_SELF_DELETE  = "app/models/COLLABORATION_SELF_DELETE";
export const MODEL_ADD                  = 'app/models/MODEL_ADD';
export const MODEL_UPDATE               = 'app/models/MODEL_UPDATE';
export const MODEL_DELETE               = 'app/models/MODEL_DELETE';
export const FIELD_ADD                  = 'app/models/FIELD_ADD';
export const FIELD_UPDATE               = 'app/models/FIELD_UPDATE';
export const FIELD_DELETE               = 'app/models/FIELD_DELETE';

export const SET_CURRENT_SITE           = 'app/models/SET_CURRENT_SITE';
export const SET_CURRENT_MODEL          = 'app/models/SET_CURRENT_MODEL';


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
            let user_o = collab_o.get('user');
            if (user_o)
              user_o
                .fetch()
                .then(user_o => {
                  let user = new UserData().setOrigin(user_o);
                  collab.user = user;
                  inResolve();
                }, inReject);
            else
              inResolve();
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
  
          promises.push(new Promise((resolve, reject) => {
            site_o.get('owner')
              .fetch()
              .then(owner_o => {
                let owner = new UserData().setOrigin(owner_o);
                site.owner = owner;
                resolve();
              }, reject);
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
  site.owner = store.getState().user.userData;
  site.nameId = getNameId(site.name, store.getState().models.sites);
  site.updateOrigin();
  
  site.origin.setACL(new Parse.ACL(Parse.User.current()));
  site.origin.save();
  
  return {
    type: SITE_ADD,
    site
  };
}

export function updateSite(site) {
  site.updateOrigin();
  site.origin.save();
  
  return {
    type: SITE_UPDATE
  };
}

export function deleteSite(site) {
  //site.origin.destroy();
  
  Parse.Cloud.run('deleteSite', {siteId: site.origin.id}, {
    success: status => {
      
    },
    error: error => {
      console.log(error);
    }
  });
  
  return {
    type: SITE_DELETE,
    site
  };
}

export function addCollaboration(user) {
  let collab = new CollaborationData();
  collab.user = user;
  collab.email = user.email;
  
  let currentSite = store.getState().models.currentSite;
  collab.site = currentSite;
  
  collab.updateOrigin();
  
  collab.origin.setACL(new Parse.ACL(currentSite.owner.origin));
  collab.origin.save()
    .then(() =>
      Parse.Cloud.run('onCollaborationModify', {
        collabId: collab.origin.id
      })
    );
  
  return {
    type: COLLABORATION_ADD,
    collab
  };
}

export function addInviteCollaboration(email) {
  let collab = new CollaborationData();
  collab.email = email;
  
  let currentSite = store.getState().models.currentSite;
  collab.site = currentSite;
  
  collab.updateOrigin();
  
  collab.origin.setACL(new Parse.ACL(currentSite.owner.origin));
  collab.origin.save();
  
  Parse.Cloud.run('inviteUser', {
    email,
    siteName: currentSite.name
  });
  
  return {
    type: COLLABORATION_ADD,
    collab
  };
}

export function updateCollaboration(collab) {
  collab.updateOrigin();
  collab.origin.save()
    .then(() =>
      Parse.Cloud.run('onCollaborationModify', {
        collabId: collab.origin.id
      })
    );
  
  return {
    type: COLLABORATION_UPDATE,
    collab
  };
}

export function deleteCollaboration(collab) {
  Parse.Cloud.run('onCollaborationModify', {
    collabId: collab.origin.id,
    deleting: true
  })
    .then(() =>
      collab.origin.destroy()
    );
  
  return {
    type: COLLABORATION_DELETE,
    collab
  };
}

export function deleteSelfCollaboration(collab) {
  Parse.Cloud.run('onCollaborationModify', {
    collabId: collab.origin.id,
    deleting: true
  })
    .then(() =>
      collab.origin.destroy()
    );
  
  return {
    type: COLLABORATION_SELF_DELETE,
    collab
  };
}


export function addModel(name) {
  let currentSite = store.getState().models.currentSite;
  
  let model = new ModelData();
  model.name = name;
  model.nameId = getNameId(name, currentSite.models);
  model.color = getRandomColor();
  model.site = currentSite;
  model.setTableName();
  
  model.updateOrigin();
  model.origin.save()
    .then(() =>
      Parse.Cloud.run('onModelAdd', {
        modelId: model.origin.id
      })
    );
  
  return {
    type: MODEL_ADD,
    model
  };
}

export function updateModel(model) {
  model.updateOrigin();
  model.origin.save();
  
  return{
    type: MODEL_UPDATE,
    model
  };
}

export function setCurrentModel(currentModel) {
  return {
    type: SET_CURRENT_MODEL,
    currentModel
  };
}

export function deleteModel(model) {
  //model.origin.destroy();
  
  Parse.Cloud.run('deleteModel', {modelId: model.origin.id}, {
    success: status => {
      
    },
    error: error => {
      console.log(error);
    }
  });
  
  return {
    type: MODEL_DELETE,
    model
  };
}

function changeTitleField(field, value = true) {
  field.isTitle = value;
  field.updateOrigin();
  field.origin.save();
}

export function addField(field) {
  field.color = getRandomColor();
  field.nameId = getNameId(field.name, field.model.fields);
  
  field.updateOrigin();
  field.origin.save();
  
  if (!field.model.hasTitle() && canBeTitle(field))
    changeTitleField(field);
  
  field.model.origin.save();
  
  return {
    type: FIELD_ADD,
    field
  };
}

export function updateField(field) {
  field.updateOrigin();
  field.origin.save();
  
  if (field.isTitle) {
    //if current field is title, remove other titles
    if (canBeTitle(field)) {
      for (let tempField of field.model.fields) {
        if (tempField != field && tempField.isTitle)
          changeTitleField(tempField, false);
      }
    } else {
      changeTitleField(field, false);
    }
  }
  
  if (!field.model.hasTitle()) {
    let titleSet = false;
    //first we check other fields to make title
    for (let tempField of field.model.fields) {
      if (tempField != field && canBeTitle(tempField)) {
        changeTitleField(tempField);
        titleSet = true;
        break;
      }
    }
    //if we can't, we try to make title current field
    if (!titleSet && canBeTitle(field))
      changeTitleField(field);
  }
  
  field.model.origin.save();
  
  return {
    type: FIELD_UPDATE,
    field
  };
}

export function deleteField(field) {
  field.origin.destroy();
  
  if (field.isTitle) {
    for (let tempField of field.model.fields) {
      if (tempField != field && canBeTitle(tempField)) {
        changeTitleField(tempField);
        break;
      }
    }
  }
  field.model.origin.save();
  
  return {
    type: FIELD_DELETE,
    field
  };
}

const initialState = {
  sites: [],
  currentSite: null,
  currentModel: null,

  role: null
};

export default function modelsReducer(state = initialState, action) {
  let sites, currentSite, currentModel, collabs;
  
  switch (action.type) {
    case INIT_END:
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
  
    case SITE_ADD:
      sites = state.sites;
      sites.push(action.site);
      return {
        ...state,
        sites
      };
      
    case SITE_DELETE:
      sites = state.sites;
      sites.splice(sites.indexOf(action.site), 1);
      
      return {
        ...state,
        sites,
        currentSite: sites[0]
      };
  
    case COLLABORATION_ADD:
      currentSite = state.currentSite;
      currentSite.collaborations.push(action.collab);
      return {
        ...state,
        currentSite
      };
  
    case COLLABORATION_DELETE:
      currentSite = state.currentSite;
      collabs = currentSite.collaborations;
      collabs.splice(collabs.indexOf(action.collab), 1);
      return {
        ...state,
        currentSite
      };
  
    case COLLABORATION_SELF_DELETE:
      currentSite = state.currentSite;
      collabs = currentSite.collaborations;
      collabs.splice(collabs.indexOf(action.collab), 1);
      
      sites = state.sites;
      sites.splice(sites.indexOf(currentSite), 1);
    
      return {
        ...state,
        currentSite: sites[0]
      };
  
    case MODEL_ADD:
      currentSite = state.currentSite;
      currentSite.models.push(action.model);
      return {
        ...state,
        currentSite
      };
      
    case MODEL_DELETE:
      currentSite = state.currentSite;
      let models = currentSite.models;
      models.splice(models.indexOf(action.model), 1);
      return {
        ...state,
        currentSite
      };
  
    case FIELD_ADD:
      currentModel = state.currentModel;
      currentModel.fields.push(action.field);
      return {
        ...state,
        currentModel
      };
  
    case FIELD_DELETE:
      currentModel = state.currentModel;
      let fields = currentModel.fields;
      fields.splice(fields.indexOf(action.field), 1);
      return {
        ...state,
        currentModel
      };
  
    case SITE_UPDATE:
    case COLLABORATION_UPDATE:
    case MODEL_UPDATE:
    case FIELD_UPDATE:
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