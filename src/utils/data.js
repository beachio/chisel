import {Parse} from 'parse';

import {store} from 'index';
import {UserData} from 'models/UserData';
import {removeOddSpaces, filterSpecials, checkURL} from 'utils/common';
import {ROLE_OWNER} from 'models/UserData';
import {send} from 'utils/server';


//==================== alert ==========

export const NAME_CORRECT             = 0;
export const NAME_ERROR_NAME_EXIST    = 1;
export const NAME_ERROR_OTHER         = 3;

export function getAlertForNameError(error) {
  switch (error) {
    case NAME_ERROR_NAME_EXIST: return {
      title: "Warning",
      description: "This name is already using. Please, select another one."
    };
    
    default: return {
      title: "Error",
      description: "Unknown error."
    };
  }
}

//============= user =============

export function getUser(email) {
  if (!email)
    return Promise.reject();
  
  return send(
    new Parse.Query(Parse.User)
      .equalTo("email", email)
      .first()
    )
      .then(user_o => {
        if (user_o)
          return new UserData().setOrigin(user_o);
        else
          throw 'User not found!';
      });
}

//============= sites ==================

export function checkSiteName(name, curSite) {
  if (!name)
    return NAME_ERROR_OTHER;
  
  name = removeOddSpaces(name);
  
  let sites = store.getState().models.sites;
  for (let site of sites) {
    if (site != curSite && site.name == name)
      return NAME_ERROR_NAME_EXIST;
  }
  
  return NAME_CORRECT;
}

export const DOMAIN_CORRECT       = 0;
export const DOMAIN_ERROR_EXIST   = 1;
export const DOMAIN_ERROR_SYNTAX  = 2;
export const DOMAIN_ERROR_OTHER   = 3;

export function checkSiteDomain(domain, curSite) {
  if (!domain)
    return DOMAIN_ERROR_OTHER;
  
  if (!checkURL(domain))
    return DOMAIN_ERROR_SYNTAX;
  
  let sites = store.getState().models.sites;
  for (let site of sites) {
    if (site != curSite && site.domain == domain)
      return DOMAIN_ERROR_EXIST;
  }
  
  return DOMAIN_CORRECT;
}

export function getSite(id) {
  let sites = store.getState().models.sites;
  for (let site of sites) {
    if (site.origin.id == id)
      return site;
  }
  return null;
}

export function getSiteByNameId(nameId) {
  let sites = store.getState().models.sites;
  for (let site of sites) {
    if (site.nameId == nameId)
      return site;
  }
  return null;
}

//============= collaborations ============

export const COLLAB_CORRECT     = 0;
export const COLLAB_ERROR_EXIST = 1;
export const COLLAB_ERROR_SELF  = 2;

export function checkCollaboration(user) {
  if (!user)
    return COLLAB_ERROR_EXIST;
  
  if (user.email == Parse.User.current().get('email'))
    return COLLAB_ERROR_SELF;
  
  let collabs = store.getState().models.currentSite.collaborations;
  for (let collab of collabs) {
    if (collab.email == user.email)
      return COLLAB_ERROR_EXIST;
  }
  
  return COLLAB_CORRECT;
}

//=============== models ==============

export function checkModelName(name, curModel) {
  if (!name || !store.getState().models.currentSite)
    return NAME_ERROR_OTHER;
  
  name = removeOddSpaces(name);
  
  let models = store.getState().models.currentSite.models;
  for (let model of models) {
    if (model != curModel && model.name == name)
      return NAME_ERROR_NAME_EXIST;
  }
  
  return NAME_CORRECT;
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

export function getModelByNameId(nameId) {
  let site = store.getState().models.currentSite;
  if (!site)
    return;
  let models = site.models;
  for (let model of models) {
    if (model.nameId == nameId)
      return model;
  }
  return null;
}

//============ fields ===========

export function checkFieldName(name) {
  if (!name || !store.getState().models.currentModel)
    return NAME_ERROR_OTHER;
  
  //name already exists
  let fields = store.getState().models.currentModel.fields;
  for (let field of fields) {
    if (field.name == name)
      return NAME_ERROR_NAME_EXIST;
  }
  
  return NAME_CORRECT;
}

//========== content =========

export function getContentForModel(model, items) {
  if (!items)
    items = store.getState().content.items;
  const res = [];
  for (let item of items) {
    if (item.model == model)
      res.push(item);
  }
  return res;
}

export function getContentForSite(site, items) {
  if (!items)
    items = store.getState().content.items;
  const res = [];
  for (let item of items) {
    if (item.model.site == site)
      res.push(item);
  }
  return res;
}

export function getContentByModelAndId(modelNameId, id, items) {
  if (!items)
    items = store.getState().content.items;
  for (let item of items) {
    if (item.model.nameId == modelNameId && id == item.origin.id)
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

export function checkContentExistense(item, items) {
  if (!items)
    items = store.getState().content.items;
  for (let tempItem of items) {
    if (item == tempItem)
      return true;
  }
  return false;
}

export function checkUniqueFieldValue(field, item) {
  const draft = item.draft ? item.draft : item;
  const value = draft.fields.get(field);
  
  const items = store.getState().content.items
    .filter(_item => _item.model == field.model)
    .filter(_item => _item != item);
  
  for (let _item of items) {
    const _value = _item.fields.get(field);
    
    if (value === _value)
      return _item;
  }
  return null;
}

//============== media ============

export function getMediaByO(origin, items) {
  if (!origin)
    return null;

  if (!items)
    items = store.getState().media.items;
  for (let item of items) {
    if (item.origin && item.origin.id == origin.id)
      return item;
  }
  return null;
}

//============ other ============

export function getRole(site) {
  const userID = Parse.User.current().id;
  if (site.owner.origin.id == userID)
    return ROLE_OWNER;
  for (let collab of site.collaborations) {
    if (collab.user.origin.id == userID)
      return collab.role;
  }
  return null;
}

export function checkPassword(password) {
  return send(
    Parse.Cloud.run('checkPassword', {password})
  );
}

export function getNameId(name, objects, reserved = []) {
  if (!name)
    return null;
  
  let nameId = filterSpecials(name);
  
  let getNameIdInc = (inc = 0) => {
    let newNameId = inc ? `${nameId}_${inc}` : nameId;
    
    if (reserved.indexOf(newNameId) != -1)
      return getNameIdInc(++inc);
    
    for (let obj of objects) {
      if (obj.nameId == newNameId)
        return getNameIdInc(++inc);
    }
    
    return newNameId;
  };
  
  return getNameIdInc();
}

export function getPayPlan(id) {
  const plans = store.getState().pay.payPlans;
  for (let plan of plans) {
    if (plan.origin && plan.origin.id == id)
      return plan;
  }
  return null;
}
