import {Parse} from 'parse';

import {store} from '../index';
import {UserData} from 'models/UserData';
import {removeOddSpaces, filterSpecials} from 'utils/common';
import {FIELD_NAMES_RESERVED} from 'models/ModelData';


export function checkSiteName(name, curSite) {
  if (!name)
    return false;
  
  name = removeOddSpaces(name);
  
  let sites = store.getState().models.sites;
  for (let site of sites) {
    if (site != curSite && site.name == name)
      return false;
  }
  
  return true;
}

export function checkSiteDomain(domain, curSite) {
  if (!domain)
    return false;
  
  let sites = store.getState().models.sites;
  for (let site of sites) {
    if (site != curSite && site.domain == domain)
      return false;
  }
  return true;
}


export const NAME_CORRECT             = 0;
export const NAME_ERROR_NAME_EXIST    = 1;
export const NAME_ERROR_NAME_RESERVED = 2;
export const NAME_ERROR_OTHER         = 3;

export function checkModelName(name) {
  if (!name || !store.getState().models.currentSite)
    return NAME_ERROR_OTHER;

  name = removeOddSpaces(name);
  let nameId = filterSpecials(name);
  
  let models = store.getState().models.currentSite.models;
  for (let model of models) {
    if (model.name == name || model.nameId == nameId)
      return NAME_ERROR_NAME_EXIST;
  }
  
  return NAME_CORRECT;
}

export function checkFieldName(name) {
  if (!name || !store.getState().models.currentModel)
    return NAME_ERROR_OTHER;
  
  name = removeOddSpaces(name);
  let nameId = filterSpecials(name);
  
  //name reserved
  for (let resName of FIELD_NAMES_RESERVED) {
    if (resName == name || resName == nameId)
      return NAME_ERROR_NAME_RESERVED;
  }
  
  //name already exists
  let fields = store.getState().models.currentModel.fields;
  for (let field of fields) {
    if (field.name == name || field.nameId == nameId)
      return NAME_ERROR_NAME_EXIST;
  }
  
  return NAME_CORRECT;
}

export function getAlertForNameError(error) {
  switch (error) {
    case NAME_ERROR_NAME_EXIST: return {
      title: "Warning",
      description: "This name is already using. Please, select another one."
    };
  
    case NAME_ERROR_NAME_RESERVED: return {
      title: "Warning",
      description: "This name is reserved. Please, select another one."
    };
  
    default: return {
      title: "Error",
      description: "Unknown error."
    };
  }
}

export function getUser(username) {
  if (!username)
    return Promise.reject();
  
  return new Promise((resolve, reject) => {
    new Parse.Query(Parse.User)
      .equalTo("username", username)
      .first()
      .then(user_o => {
        if (user_o)
          resolve(new UserData().setOrigin(user_o));
        else
          reject();
      }, reject)
  });
}

export const COLLAB_CORRECT     = 0;
export const COLLAB_ERROR_EXIST = 1;
export const COLLAB_ERROR_SELF  = 2;

export function checkCollaboration(user) {
  if (!user)
    return COLLAB_ERROR_EXIST;
  
  if (user.username == Parse.User.current().get('username'))
    return COLLAB_ERROR_SELF;
  
  let collabs = store.getState().models.currentSite.collaborations;
  for (let collab of collabs) {
    if (collab.user.origin.id == user.origin.id)
      return COLLAB_ERROR_EXIST;
  }
  
  return COLLAB_CORRECT;
}

export function modelToJSON(model) {
  return JSON.stringify(model, null, 2);
}

export function getContentForModel(model) {
  let items = store.getState().content.items;
  let res = [];
  for (let item of items) {
    if (item.model == model)
      res.push(item);
  }
  return res;
}

export function getContentForSite(site) {
  let items = store.getState().content.items;
  let res = [];
  for (let item of items) {
    if (item.model.site == site)
      res.push(item);
  }
  return res;
}

export function getModelByName(name) {
  let site = store.getState().models.currentSite;
  if (!site)
    return;
  let models = site.models;
  for (let model of models) {
    if (model.name == name)
      return model;
  }
  return null;
}

export function getMediaByO(origin) {
  if (!origin)
    return null;

  let items = store.getState().media.items;
  for (let item of items) {
    if (item.origin && item.origin.id == origin.id)
      return item;
  }
  return null;
}

export function getContentByO(origin, items) {
  if (!origin)
    return null;
  
  if (!items)
    items = store.getState().content.items;
  for (let item of items) {
    if (item.origin && item.origin.id == origin.id)
      return item;
  }
  return null;
}