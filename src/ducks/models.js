import {Parse} from 'parse';

import {store} from '../index';
import {UserData, CollaborationData, ROLE_OWNER} from 'models/UserData';
import {SiteData, ModelData, ModelFieldData, canBeTitle} from 'models/ModelData';
import {getRandomColor} from 'utils/common';
import {getNameId, getRole} from 'utils/data';
import {LOGOUT} from './user';
import {send} from 'utils/server';


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
  let sites = [];
  return send(
    new Parse.Query(CollaborationData.OriginClass)
      .equalTo("user", Parse.User.current())
      .find()
  )
    .then(collabs => {
      for (let collab of collabs)
        sites.push(collab.get('site'));

      return send(Parse.Object.fetchAllIfNeeded(sites));
    })
    .then(() => sites);
}

function requestUserSites() {
  return send(
    new Parse.Query(SiteData.OriginClass)
      .equalTo("owner", Parse.User.current())
      .find()
  );
}

function requestCollaborationsPost(sites_o, sites) {
  return send(
    new Parse.Query(CollaborationData.OriginClass)
      .containedIn("site", sites_o)
      .find()
  )
    .then(collabs_o => {
      let promises = [];
      for (let collab_o of collabs_o) {
        let collab = new CollaborationData().setOrigin(collab_o);
        let user_o = collab_o.get('user');
        if (user_o)
          promises.push(
            send(user_o.fetch())
              .then(user_o => {
                let user = new UserData().setOrigin(user_o);
                collab.user = user;
              })
          );

        let site_o = collab_o.get("site");
        for (let site of sites) {
          if (site.origin.id == site_o.id) {
            collab.site = site;
            site.collaborations.push(collab);
            break;
          }
        }
      }

      return Promise.all(promises);
    });
}

function requestModels(sites_o, sites, models_o, models) {
  return send(
    new Parse.Query(ModelData.OriginClass)
      .containedIn("site", sites_o)
      .find()
  )
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
    });
}

function requestFields(models_o, models) {
  return send(
    new Parse.Query(ModelFieldData.OriginClass)
      .containedIn("model", models_o)
      .find()
  )
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
  
          promises.push(
            send(
              site_o.get('owner').fetch()
            )
              .then(owner_o =>
                site.owner = new UserData().setOrigin(owner_o)
              )
          );
          
          sites.push(site);
        }

        return Promise.all(promises)
          .then(() => Promise.all([
            requestCollaborationsPost(sites_o, sites),
            requestModels(sites_o, sites, models_o, models)
              .then(() => requestFields(models_o, models))
              .then(() => {
                for (let model of models) {
                  model.fields.sort((a, b) => {
                    if (a.order > b.order)
                      return 1;
                    return -1;
                  });
                }
              })
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
  
  const role = getRole(currentSite);
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
  send(site.origin.save());

  return {
    type: SITE_ADD,
    site
  };
}

export function updateSite(site) {
  site.updateOrigin();
  send(site.origin.save());
  
  return {
    type: SITE_UPDATE
  };
}

export function deleteSite(site) {
  //site.origin.destroy();
  
  send(Parse.Cloud.run('deleteSite', {siteId: site.origin.id}));
  
  return {
    type: SITE_DELETE,
    site
  };
}

export function addCollaboration(user, email) {
  let collab = new CollaborationData();
  collab.user = user;
  collab.email = email;
  
  let currentSite = store.getState().models.currentSite;
  collab.site = currentSite;
  
  collab.updateOrigin();
  
  collab.origin.setACL(new Parse.ACL(currentSite.owner.origin));
  send(collab.origin.save())
    .then(() =>
      send(
        Parse.Cloud.run('onCollaborationModify', {collabId: collab.origin.id})
      )
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
  send(collab.origin.save());

  send(
    Parse.Cloud.run('inviteUser', {
      email,
      siteName: currentSite.name
    })
  );
  
  return {
    type: COLLABORATION_ADD,
    collab
  };
}

export function updateCollaboration(collab) {
  collab.updateOrigin();
  send(collab.origin.save())
    .then(() =>
      send(
        Parse.Cloud.run('onCollaborationModify', {collabId: collab.origin.id})
      )
    );
  
  return {
    type: COLLABORATION_UPDATE,
    collab
  };
}

export function deleteCollaboration(collab) {
  send(
    Parse.Cloud.run('onCollaborationModify', {
      collabId: collab.origin.id,
      deleting: true
    })
  )
    .then(() =>
      send(collab.origin.destroy())
    );
  
  return {
    type: COLLABORATION_DELETE,
    collab
  };
}

export function deleteSelfCollaboration(collab) {
  send(
    Parse.Cloud.run('onCollaborationModify', {
      collabId: collab.origin.id,
      deleting: true
    })
  )
    .then(() =>
      send(collab.origin.destroy())
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
  send(model.origin.save())
    .then(() =>
      send(Parse.Cloud.run('onModelAdd', {modelId: model.origin.id}))
    );

  return {
    type: MODEL_ADD,
    model
  };
}

export function updateModel(model) {
  model.updateOrigin();
  send(model.origin.save());
  
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
  
  send(Parse.Cloud.run('deleteModel', {modelId: model.origin.id}));
  
  return {
    type: MODEL_DELETE,
    model
  };
}

//if current field is title, remove other titles
function checkNewTitle(field) {
  if (!canBeTitle(field))
    field.isTitle = false;
  if (!field.isTitle)
    return;

  for (let tempField of field.model.fields) {
    if (tempField != field && tempField.isTitle) {
      tempField.isTitle = false;
      tempField.updateOrigin();
      send(tempField.origin.save());
    }
  }
}

export function addField(field) {
  field.color = getRandomColor();
  field.nameId = getNameId(field.name, field.model.fields);
  field.order = field.model.fields.length;

  checkNewTitle(field);

  field.updateOrigin();
  send(field.origin.save())
    .then(() =>
      send(Parse.Cloud.run('onFieldAdd', {fieldId: field.origin.id}))
    );
  send(field.model.origin.save());
  
  return {
    type: FIELD_ADD,
    field
  };
}

export function updateField(field) {
  checkNewTitle(field);

  field.updateOrigin();
  send(field.origin.save());
  send(field.model.origin.save());
  
  return {
    type: FIELD_UPDATE,
    field
  };
}

export function deleteField(field) {
  send(field.origin.destroy());
  send(field.model.origin.save());
  
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
        currentSite: null
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
      return {...state};

    case FIELD_UPDATE:
      action.field.model.fields.sort((a, b) => {
        if (a.order > b.order)
          return 1;
        return -1;
      });
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