import {Parse} from 'parse';

import {store} from '../index';
import {UserData} from 'models/UserData';
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
  if (!name || !store.getState().models.currentSite)
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
  if (!name || !store.getState().models.currentModel)
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

export function getUser(email) {
  if (!email)
    return Promise.reject();
  
  return new Promise((resolve, reject) => {
    new Parse.Query(Parse.User)
      .equalTo("email", email)
      .first()
      .then(user_o => {
        if (user_o)
          resolve(new UserData().setOrigin(user_o));
        else
          reject();
      }, reject)
  });
}

export function checkCollaboration(user) {
  if (!user)
    return false;
  
  if (user.origin == Parse.User.current())
    return false;
  
  let collabs = store.getState().models.currentSite.collaborations;
  for (let collab of collabs) {
    if (collab.user.origin.id == user.origin.id)
      return false;
  }
  
  return true;
}

export function modelToJSON(model) {
  return JSON.stringify(model, null, 2);
}