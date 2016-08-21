import {Parse} from 'parse';

import {store} from '../index';
import {SiteData, ModelData, ModelFieldData} from 'models/ModelData';


export const INIT_END               = 'app/models/INIT_END';

export const SITE_ADD               = 'app/models/SITE_ADD';
export const SITE_UPDATED           = 'app/models/SITE_UPDATED';
export const MODEL_ADD              = 'app/models/MODEL_ADD';
export const MODEL_UPDATED          = 'app/models/MODEL_UPDATED';
export const FIELD_ADD              = 'app/models/FIELD_ADD';
export const FIELD_UPDATED          = 'app/models/FIELD_UPDATED';
export const FIELD_DELETED          = 'app/models/FIELD_DELETED';

export const SET_CURRENT_SITE       = 'app/models/SET_CURRENT_SITE';
export const SET_CURRENT_MODEL      = 'app/models/SET_CURRENT_MODEL';


export function init() {
  return dispatch => {
    let sites_o = [];
    let sites = [];
    let models_o = [];
    let models = [];
  
    new Promise((resolve, reject) => {
      new Parse.Query(SiteData.OriginClass)
        .find()
        .then(_sites_o => {
          sites_o = _sites_o;
      
          for (let site_o of sites_o) {
            if (site_o.get('owner').id != Parse.User.current().id)
              continue;
              
            let site = new SiteData().setOrigin(site_o);
            sites.push(site);
          }
          
          resolve();
        }, reject);
    })
      .then(() => {
        return new Promise((resolve, reject) => {
          new Parse.Query(ModelData.OriginClass)
            .containedIn("site", sites_o)
            .find()
            .then(_models_o => {
              models_o = _models_o;
        
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
      })
      .then(() => {
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
  
            dispatch({
              type: INIT_END,
              sites
            });
          });
      });
  }
}

export function setCurrentSite(currentSite) {
  return {
    type: SET_CURRENT_SITE,
    currentSite
  };
}

export function addSite(site) {
  let sites = store.getState().models.sites;
  sites.push(site);
  
  site.owner = Parse.User.current();
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
  currentModel: null
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
        currentSite:  action.currentSite
      };

    case SET_CURRENT_MODEL:
      return {
        ...state,
        currentModel: action.currentModel
      };
  
    case SITE_UPDATED:
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