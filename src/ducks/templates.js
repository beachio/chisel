import {Parse} from "parse";

import {send} from "utils/server";
import {TemplateData, TemplateModelData, TemplateModelFieldData} from "models/TemplateData";


export const INIT_END   = 'app/templates/INIT_END';


function requestTemplates(templates) {
  return send(
    new Parse.Query(TemplateData.OriginClass)
      .find()
  )
    .then(templates_o => {
      for (let template_o of templates_o) {
        let template = new TemplateData().setOrigin(template_o);
        templates.push(template);
      }
    });
}

function requestModels(templates, models) {
  return send(
    new Parse.Query(TemplateModelData.OriginClass)
      .find()
  )
    .then(models_o => {
      for (let model_o of models_o) {
        const model = new TemplateModelData().setOrigin(model_o);
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

function requestFields(models) {
  return send(
    new Parse.Query(TemplateModelFieldData.OriginClass)
      .find()
  )
    .then(fields_o => {
      for (let field_o of fields_o) {
        const field = new TemplateModelFieldData().setOrigin(field_o);
        const model_o = field_o.get("model");
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
    let templates = [];
    let models = [];
  
    requestTemplates(templates)
      
      .then(() => requestModels(templates, models))
      
      .then(() => requestFields(models))
      
      .then(() => {
        for (let model of models) {
          model.fields.sort((a, b) => {
            if (a.order > b.order)
              return 1;
            return -1;
          });
        }
      })
      
      .then(() =>
        dispatch({
          type: INIT_END,
          templates
        })
      );
  }
}

const initialState = {
  templates: []
};

export default function templatesReducer(state = initialState, action) {
  switch (action.type) {
    case INIT_END:
      return {
        ...state,
        templates: action.templates
      };
  
    default:
      return state;
  }
}
