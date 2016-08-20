import {store} from '../index';
import {removeSpaces, filterSpecials} from 'utils/common';


export function checkSiteName(name) {
  if (!name)
    return false;
  
  name = removeSpaces(name);
  let nameId = filterSpecials(name);
  
  let sites = store.getState().models.sites;
  for (let site of sites) {
    if (site.name == name || site.nameId == nameId)
      return false;
  }
  
  return true;
}

export function checkModelName(name) {
  if (!name)
    return false;
  
  name = removeSpaces(name);
  let nameId = filterSpecials(name);
  
  let models = store.getState().models.currentSite.models;
  for (let model of models) {
    if (model.name == name || model.nameId == nameId)
      return false;
  }
  
  return true;
}

export function checkFieldName(name) {
  if (!name)
    return false;
  
  name = removeSpaces(name);
  let nameId = filterSpecials(name);
  
  let fields = store.getState().models.currentModel.fields;
  for (let field of fields) {
    if (field.name == name || field.nameId == nameId)
      return false;
  }
  
  return true;
}