import {Parse} from 'parse';

import {store} from 'index';
import {send, getAllObjects} from 'utils/server';
import {LOGOUT} from 'ducks/user';
import {UserData, CollaborationData, ROLE_OWNER} from 'models/UserData';
import {canBeTitle, FIELD_NAMES_RESERVED, ModelData, ModelFieldData, SiteData, TemplateData} from 'models/ModelData';
import {getRandomColor} from 'utils/common';
import {filterSpecials} from 'utils/strings';
import {getSite, getModelFromAnySite, getNameId, getRole} from 'utils/data';


export const INIT_END                   = 'app/models/INIT_END';

export const SITE_ADD                   = 'app/models/SITE_ADD';
export const SITE_ADDING_PROBLEM        = 'app/models/SITE_ADDING_PROBLEM';
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


function requestTemplates(templates_o, templates) {
  return send(getAllObjects(
    new Parse.Query(TemplateData.OriginClass)
  ))
    .then(_templates_o => {
      Array.prototype.push.apply(templates_o, _templates_o);

      for (let template_o of templates_o)
        templates.push(new TemplateData().setOrigin(template_o));
    });
}

function requestCollaborationsPre(sites) {
  return send(getAllObjects(
    new Parse.Query(CollaborationData.OriginClass)
      .equalTo("user", Parse.User.current())
  ))
    .then(collabs => {
      for (let collab of collabs)
        sites.push(collab.get('site'));

      return send(Parse.Object.fetchAllIfNeeded(sites));
    });
}

function requestUserSites() {
  return send(getAllObjects(
    new Parse.Query(SiteData.OriginClass)
      .equalTo("owner", Parse.User.current())
  ));
}

function requestCollaborationsPost(sites_o, sites) {
  return send(getAllObjects(
    new Parse.Query(CollaborationData.OriginClass)
      .containedIn("site", sites_o)
  ))
    .then(collabs_o => {
      const promises = [];
      for (let collab_o of collabs_o) {
        const collab = new CollaborationData().setOrigin(collab_o);
        const user_o = collab_o.get('user');
        if (user_o)
          promises.push(
            send(user_o.fetch())
              .then(user_o =>
                collab.user = new UserData().setOrigin(user_o)
              )
              .catch(() => {})
          );

        const site_o = collab_o.get("site");
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

function requestModels(templates_o, templates, sites_o, sites, models_o, models) {
  return send(getAllObjects(
    new Parse.Query(ModelData.OriginClass)
      .containedIn("site", sites_o)
  ))
    .then(_models_o => {
      Array.prototype.push.apply(models_o, _models_o);

      for (let model_o of _models_o) {
        const model = new ModelData().setOrigin(model_o);
        const site_o = model_o.get("site");
        for (let site of sites) {
          if (site.origin.id == site_o.id) {
            model.site = site;
            site.models.push(model);
            models.push(model);
            break;
          }
        }
      }

      return send(getAllObjects(
        new Parse.Query(ModelData.OriginClass)
          .equalTo("site", undefined)
          .containedIn("template", templates_o)
      ));
    })

    .then(_models_o => {
      Array.prototype.push.apply(models_o, _models_o);

      for (let model_o of _models_o) {
        const model = new ModelData().setOrigin(model_o);
        const template_o = model_o.get("template");
        for (let template of templates) {
          if (template.origin.id == template_o.id) {
            model.template = template;
            template.models.push(model);
            models.push(model);
            break;
          }
        }
      }
    });
}

function requestFields(models_o, models) {
  return send(getAllObjects(
    new Parse.Query(ModelFieldData.OriginClass)
      .containedIn("model", models_o)
  ))
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

async function subscribeToCollaborations() {
  const query = new Parse.Query(CollaborationData.OriginClass);
  const subscription = await query.subscribe();

  const onCreate = async (collab_o) => {
    const site_o = collab_o.get('site');
    const site = getSite(site_o.id);
    if (site && site.collaborations.find(c => c.email == collab_o.get('email')))
      return;
    if (!site)
      return;

    const collab = new CollaborationData().setOrigin(collab_o);
    collab.site = site;
    let user_o = collab_o.get('user');
    if (user_o) {
      try {
        user_o = await send(user_o.fetch());
        collab.user = new UserData().setOrigin(user_o);
      } catch (e) {}
    }
    store.dispatch(addCollaborationFromServer(collab));
  };
  subscription.on('create', onCreate);
  subscription.on('enter', onCreate);

  subscription.on('update', async (collab_o) => {
    const site_o = collab_o.get('site');
    const site = getSite(site_o.id);
    if (!site)
      return;

    const collab = site.collaborations.find(c => c.origin.id == collab_o.id);
    if (!collab)
      return;

    let user_o = collab_o.get('user');
    const userAppearing = collab_o.get('user') && !collab.user;
    if (!userAppearing && collab_o.get('role') == collab.role)
      return;

    collab.role = collab_o.get('role');
    if (userAppearing) {
      try {
        user_o = await send(user_o.fetch());
        collab.user = new UserData().setOrigin(user_o);
      } catch (e) {}
    }
    store.dispatch(updateCollaborationFromServer(collab));
  });

  const onDelete = (collab_o) => {
    const site_o = collab_o.get('site');
    const site = getSite(site_o.id);
    if (!site)
      return;

    const collab = site.collaborations.find(c => c.origin.id == collab_o.id);
    if (!collab)
      return;

    store.dispatch(deleteCollaborationFromServer(collab));
  };
  subscription.on('delete', onDelete);
  subscription.on('leave', onDelete);
}

async function subscribeToSites() {
  const query = new Parse.Query(SiteData.OriginClass);
  const subscription = await query.subscribe();

  subscription.on('enter', async (site_o) => {
    let site = getSite(site_o.id);
    if (site)
      return;

    site = new SiteData().setOrigin(site_o);

    const owner_o = await send(site_o.get('owner').fetch());
    site.owner = new UserData().setOrigin(owner_o);

    // getting collaborations for site
    const collabs_o = await send(getAllObjects(
      new Parse.Query(CollaborationData.OriginClass)
        .equalTo("site", site_o)
    ));
    for (let collab_o of collabs_o) {
      const collab = new CollaborationData().setOrigin(collab_o);
      let user_o = collab_o.get('user');
      if (user_o) {
        try {
          user_o = await send(user_o.fetch());
          collab.user = new UserData().setOrigin(user_o);
        } catch(e) {}
      }

      collab.site = site;
      site.collaborations.push(collab);
    }

    // getting models for site
    const models_o = await send(getAllObjects(
      new Parse.Query(ModelData.OriginClass)
        .equalTo("site", site_o)
    ));
    for (let model_o of models_o) {
      const model = new ModelData().setOrigin(model_o);
      model.site = site;
      site.models.push(model);
    }

    //getting fields
    await requestFields(models_o, site.models);

    store.dispatch(addSiteFromServer(site));
  });

  subscription.on('update', (site_o) => {
    const site = getSite(site_o.id);
    if (!site)
      return;

    const siteNew = new SiteData().setOrigin(site_o);
    const siteNewData = siteNew.toJSON();
    const siteData = site.toJSON();
    if (JSON.stringify(siteNewData) == JSON.stringify(siteData))
      return;

    Object.assign(site, siteNewData);
    store.dispatch(updateSiteFromServer(site));
  });

  subscription.on('delete', (site_o) => {
    const site = getSite(site_o.id);
    if (!site)
      return;

    store.dispatch(deleteSiteFromServer(site));
  });

  subscription.on('leave', (site_o) => {
    const site = getSite(site_o.id);
    if (!site)
      return;

    store.dispatch(deleteSiteFromServer(site, true));
  });
}

async function subscribeToModels() {
  const query = new Parse.Query(ModelData.OriginClass);
  const subscription = await query.subscribe();

  subscription.on('create', (model_o) => {
    const site_o = model_o.get('site');
    const site = getSite(site_o.id);
    if (site && site.models.find(m => m.nameId == model_o.get('nameId')))
      return;

    if (!site)
      return;

    const model = new ModelData().setOrigin(model_o);
    model.site = site;
    store.dispatch(addModelFromServer(model));
  });

  subscription.on('update', (model_o) => {
    const site_o = model_o.get('site');
    const site = getSite(site_o.id);
    if (!site)
      return;

    const model = site.models.find(m => m.origin.id == model_o.id);
    if (!model)
      return;

    const modelNew = new ModelData().setOrigin(model_o);
    const modelNewData = modelNew.toJSON();
    delete modelNewData.fields;
    const modelData = model.toJSON();
    delete modelData.fields;
    if (JSON.stringify(modelNewData) == JSON.stringify(modelData))
      return;

    Object.assign(model, modelNewData);
    store.dispatch(updateModelFromServer(model));
  });

  subscription.on('delete', (model_o) => {
    const site_o = model_o.get('site');
    const site = getSite(site_o.id);
    if (!site)
      return;

    const model = site.models.find(m => m.origin.id == model_o.id);
    if (!model)
      return;

    store.dispatch(deleteModelFromServer(model));
  });
}

async function subscribeToFields() {
  const query = new Parse.Query(ModelFieldData.OriginClass);
  const subscription = await query.subscribe();

  subscription.on('create', (field_o) => {
    const model_o = field_o.get('model');
    const model = getModelFromAnySite(model_o.id);
    if (model && model.fields.find(f => f.nameId == field_o.get('nameId')))
      return;

    if (!model)
      return;

    const field = new ModelFieldData().setOrigin(field_o);
    field.model = model;
    store.dispatch(addFieldFromServer(field));
  });

  subscription.on('update', (field_o) => {
    const model_o = field_o.get('model');
    const model = getModelFromAnySite(model_o.id);
    if (!model)
      return;

    const field = model.fields.find(f => f.origin.id == field_o.id);
    if (!field)
      return;

    const fieldNew = new ModelFieldData().setOrigin(field_o);
    const fieldNewData = fieldNew.toJSON();
    const fieldData = field.toJSON();
    if (JSON.stringify(fieldNewData) == JSON.stringify(fieldData))
      return;

    Object.assign(field, fieldNewData);
    store.dispatch(updateFieldFromServer(field));
  });

  subscription.on('delete', (field_o) => {
    const model_o = field_o.get('model');
    const model = getModelFromAnySite(model_o.id);
    if (!model)
      return;

    const field = model.fields.find(f => f.origin.id == field_o.id);
    if (!field)
      return;

    store.dispatch(deleteFieldFromServer(field));
  });
}

export function init() {
  return dispatch => {
    let templates_o = [];
    let templates = [];

    let sites_o = [];
    let sites = [];

    let models_o = [];
    let models = [];

    requestTemplates(templates_o, templates)

      .then(() => requestCollaborationsPre(sites_o))

      .then(requestUserSites)

      .then(sitesUser_o => {
        sites_o = sites_o.concat(sitesUser_o);
        let promises = [];
        for (let site_o of sites_o) {
          let site = new SiteData().setOrigin(site_o);

          promises.push(
            send(site_o.get('owner').fetch())
              .then(owner_o =>
                site.owner = new UserData().setOrigin(owner_o)
              )
          );

          sites.push(site);
        }

        return Promise.all(promises);
      })

      .then(() => Promise.all([
        requestCollaborationsPost(sites_o, sites),

        requestModels(templates_o, templates, sites_o, sites, models_o, models)
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
      ]))

      .then(() => {
        subscribeToCollaborations();
        subscribeToSites();
        subscribeToModels();
        subscribeToFields();

        dispatch({
          type: INIT_END,
          templates,
          sites
        });
      });
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

export function addSite(site, template = null) {
  return dispatch => {
    site.owner = store.getState().user.userData;

    let nameId = filterSpecials(site.name);
    nameId = `u_${site.owner.origin.id}__${nameId}`;
    nameId = getNameId(nameId, store.getState().models.sites);
    site.nameId = nameId;

    site.updateOrigin();
    site.origin.setACL(new Parse.ACL(site.owner.origin));

    if (template) {
      for (let model of template.models) {
        const newModel_o = model.origin.clone();
        const newModel = new ModelData().setOrigin(newModel_o);
        newModel.site = site;
        newModel.setTableName();
        site.models.push(newModel);

        for (let field of model.fields) {
          const newField_o = field.origin.clone();
          const newField = new ModelFieldData().setOrigin(newField_o);
          newField.model = newModel;
          newModel.fields.push(newField);
        }
      }

      send(site.origin.save())
        .then(() => {
          const promises = [];
          for (let model of site.models) {
            model.updateOrigin();
            promises.push(send(model.origin.save()));
          }
          return Promise.all(promises);
        })
        .then(() => {
          const promises = [];
          for (let model of site.models) {
            for (let field of model.fields) {
              field.updateOrigin();
              promises.push(send(field.origin.save()));
            }
          }
          return Promise.all(promises);
        })
        .catch(e => {
          dispatch({
            type: SITE_ADDING_PROBLEM
          });
        });

    } else {
      send(site.origin.save())
        .catch(e => {
          dispatch({
            type: SITE_ADDING_PROBLEM
          });
        });
    }

    dispatch({
      type: SITE_ADD,
      site
    });
  }
}

export function addSiteFromServer(site) {
  return {
    type: SITE_ADD,
    site,
    fromServer: true
  };
}


export function updateSite(site) {
  site.updateOrigin();
  send(site.origin.save());

  return {
    type: SITE_UPDATE
  };
}

export function updateSiteFromServer(site) {
  return {
    type: SITE_UPDATE
  };
}

export function deleteSite(site) {
  send(site.origin.destroy());

  return {
    type: SITE_DELETE,
    site
  };
}

export function deleteSiteFromServer(site, isLeave = false) {
  return {
    type: SITE_DELETE,
    site,
    fromServer: true,
    isLeave
  };
}

export function addCollaboration(user, email) {
  let collab = new CollaborationData();
  collab.user = user;
  collab.email = email;

  let currentSite = store.getState().models.currentSite;
  collab.site = currentSite;

  collab.updateOrigin();
  send(collab.origin.save());

  return {
    type: COLLABORATION_ADD,
    collab
  };
}

export function addCollaborationFromServer(collab) {
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
  send(collab.origin.save());

  return {
    type: COLLABORATION_UPDATE,
    collab
  };
}

export function updateCollaborationFromServer(collab) {
  const {currentSite} = store.getState().models;
  const role = getRole(currentSite);
  return {
    type: COLLABORATION_UPDATE,
    collab,
    role
  };
}

export function deleteCollaboration(collab) {
  send(collab.origin.destroy());

  return {
    type: COLLABORATION_DELETE,
    collab
  };
}

export function deleteCollaborationFromServer(collab) {
  return {
    type: COLLABORATION_DELETE,
    collab
  };
}

export function deleteSelfCollaboration(collab) {
  deleteCollaboration(collab);
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
  send(model.origin.save());

  return {
    type: MODEL_ADD,
    model
  };
}

export function addModelFromServer(model) {
  return {
    type: MODEL_ADD,
    model
  };
}

export function updateModel(model) {
  model.updateOrigin();
  send(model.origin.save());

  return {
    type: MODEL_UPDATE,
    model
  };
}

export function updateModelFromServer(model) {
  return {
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
  send(model.origin.destroy());

  return {
    type: MODEL_DELETE,
    model
  };
}

export function deleteModelFromServer(model) {
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
  field.nameId = getNameId(field.name, field.model.fields, FIELD_NAMES_RESERVED);
  field.order = field.model.fields.length;

  checkNewTitle(field);

  field.updateOrigin();
  send(field.origin.save());
  send(field.model.origin.save());

  return {
    type: FIELD_ADD,
    field
  };
}

export function addFieldFromServer(field) {
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

export function updateFieldFromServer(field) {
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

export function deleteFieldFromServer(field) {
  return {
    type: FIELD_DELETE,
    field
  };
}

const initialState = {
  templates: [],
  sites: [],
  currentSite: null,
  currentModel: null,

  role: null
};

export default function modelsReducer(state = initialState, action) {
  let sites, currentSite, collabs, models, fields;

  switch (action.type) {
    case INIT_END:
      return {
        ...state,
        templates: action.templates,
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

      if (action.fromServer)
        return {
          ...state,
          sites
        };
      else
        return {
          ...state,
          sites,
          currentSite: action.site,
          role: ROLE_OWNER
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
      collabs = action.collab.site.collaborations;
      collabs.push(action.collab);
      return {
        ...state
      };

    case COLLABORATION_UPDATE:
      if (action.role)
        return {
        ...state,
        role: action.role
      };
      else
        return {...state};

    case COLLABORATION_DELETE:
      collabs = action.collab.site.collaborations;
      collabs.splice(collabs.indexOf(action.collab), 1);
      return {
        ...state
      };

    case COLLABORATION_SELF_DELETE:
      collabs = action.collab.site.collaborations;
      collabs.splice(collabs.indexOf(action.collab), 1);

      sites = state.sites;
      sites.splice(sites.indexOf(currentSite), 1);

      return {
        ...state,
        currentSite: sites[0],
        sites
      };

    case MODEL_ADD:
      action.model.site.models.push(action.model);
      return {
        ...state
      };

    case MODEL_DELETE:
      models = action.model.site.models;
      models.splice(models.indexOf(action.model), 1);
      return {
        ...state
      };

    case FIELD_ADD:
      action.field.model.fields.push(action.field);
      return {
        ...state
      };

    case FIELD_DELETE:
      fields = action.field.model.fields;
      fields.splice(fields.indexOf(action.field), 1);
      return {
        ...state
      };

    case SITE_UPDATE:
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
