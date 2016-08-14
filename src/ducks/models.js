import {Parse} from 'parse';

import {store} from '../index';
import {ModelData, ModelFieldData} from '../models/ModelData';

export const INIT_END           = 'app/models/INIT_END';
export const MODEL_ADD          = 'app/models/MODEL_ADD';
export const SET_CURRENT_MODELS = 'app/models/SET_CURRENT_MODELS';


export function init() {
  return dispatch => {
    let models_o = [];
    let models = [];
    
    new Promise((resolve, reject) => {
      new Parse.Query(ModelData.OriginClass)
        .find()
        .then(_models_o => {
          models_o = _models_o;
  
          let sites = store.getState().sites.sitesUser;
          
          for (let model_o of models_o) {
            let model = new ModelData().setOrigin(model_o);
            
            for (let site of sites) {
              if (site.origin.id == model_o.get("site").id)
                model.site = site;
            }
            
            models.push(model);
          }
          
          resolve();
        }, reject)
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
                }
              }
            }
            
            dispatch({
              type: INIT_END,
              models
            });
  
            store.dispatch(setCurrentSite());
          });
      });
  }
}

export function setCurrentSite() {
  let modelsCurrent = [];
  let currentSite = store.getState().sites.currentSite;
  for (let model of store.getState().models.models) {
    if (model.site == currentSite)
      modelsCurrent.push(model);
  }
  
  return {
    type: SET_CURRENT_MODELS,
    modelsCurrent
  };
}

export function addModel(model) {
  return dispatch => {
    model.site = store.getState().sites.currentSite;
    model.updateOrigin();
    model.origin.save();
  
    let models = store.getState().models.models;
    models.push(model);
  
    dispatch({
      type: MODEL_ADD,
      models
    });
    
    store.dispatch(setCurrentSite());
  }
}


const initialState = {
  models: [],
  modelsCurrent: []
};

export default function modelsReducer(state = initialState, action) {
  switch (action.type) {
    case INIT_END:
    case MODEL_ADD:
      return {
        ...state,
        models:     action.models
      };
    
    case SET_CURRENT_MODELS:
      return {
        ...state,
        modelsCurrent: action.modelsCurrent
      };
    
    default:
      return state;
  }
}