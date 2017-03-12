import {Parse} from 'parse';

import {store} from '../index';
import {UserData, CollaborationData, ROLE_ADMIN, ROLE_DEVELOPER, ROLE_EDITOR, ROLE_OWNER} from 'models/UserData';


export const COLLABORATION_ADD    = 'app/ACLset/COLLABORATION_ADD';
export const COLLABORATION_UPDATE = 'app/ACLset/COLLABORATION_UPDATE';
export const COLLABORATION_DELETE = 'app/ACLset/COLLABORATION_DELETE';
export const MODEL_ADD            = 'app/ACLset/MODEL_ADD';
export const CONTENT_ADD          = 'app/ACLset/CONTENT_ADD';


function collabModify(collab, deleting = false) {
  let currentSite = store.getState().models.currentSite;
  
  //ACL for collaborations
  if (!deleting) {
    for (let tempCollab of currentSite.collaborations) {
      let collabACL = tempCollab.origin.getACL();
      if (!collabACL)
        collabACL = new Parse.ACL(currentSite.owner.origin);
      
      collabACL.setReadAccess(collab.user.origin, true);
      collabACL.setWriteAccess(collab.user.origin, collab.role == ROLE_ADMIN || tempCollab.user.origin == collab.user.origin);
  
      tempCollab.origin.setACL(collabACL);
      tempCollab.origin.save();
    }
  }
  
  //ACL for site
  let siteACL = currentSite.origin.getACL();
  if (!siteACL)
    siteACL = new Parse.ACL(currentSite.owner.origin);
  
  siteACL.setReadAccess(collab.user.origin, !deleting);
  siteACL.setWriteAccess(collab.user.origin, !deleting && collab.role == ROLE_ADMIN);
  currentSite.origin.setACL(siteACL);
  currentSite.origin.save();
  
  //ACL for models and content items
  let contentItems = store.getState().content.items;
  
  for (let model of currentSite.models) {
    let modelACL = model.origin.getACL();
    if (!modelACL)
      modelACL = new Parse.ACL(currentSite.owner.origin);
    
    modelACL.setReadAccess(collab.user.origin, !deleting);
    modelACL.setWriteAccess(collab.user.origin, !deleting && collab.role == ROLE_ADMIN);
    model.origin.setACL(modelACL);
    model.origin.save();
    
    /*
    let Content = Parse.Object.extend(model.tableName);
    let contentACL = Content.getACL();
    contentACL.setReadAccess(collab.user.origin, !deleting);
    contentACL.setWriteAccess(collab.user.origin, !deleting && (collab.role == ROLE_ADMIN || collab.role == ROLE_DEVELOPER));
    Content.setACL(contentACL);
    Content.save();
    */
  }
}

export function collaborationAdd(collab) {
  collabModify(collab);
  return {type: COLLABORATION_ADD};
}

export function collaborationUpdate(collab) {
  collabModify(collab);
  return {type: COLLABORATION_UPDATE};
}

export function collaborationDelete(collab) {
  collabModify(collab, true);
  return {type: COLLABORATION_DELETE};
}

export function modelAdd(model) {
  let currentSite = store.getState().models.currentSite;
  
  let acl = new Parse.ACL(currentSite.owner.origin);
  for (let collab of currentSite.collaborations) {
    acl.setReadAccess(collab.user.origin, true);
    acl.setWriteAccess(collab.user.origin, collab.role == ROLE_ADMIN);
  }
  model.origin.setACL(acl);
  model.origin.save();
  
  /*
  let Content = Parse.Object.extend(model.tableName);
  let contentACL = Content.getACL();
  contentACL.setReadAccess(collab.user.origin, !deleting);
  contentACL.setWriteAccess(collab.user.origin, !deleting && (collab.role == ROLE_ADMIN || collab.role == ROLE_DEVELOPER));
  Content.setACL(contentACL);
  Content.save();
  */
  
  return {type: MODEL_ADD};
}

export function contentAdd(model) {
  return {type: CONTENT_ADD};
}

const initialState = {
};

export default function ACLsetReducer(state = initialState, action) {
  switch (action.type) {
    case COLLABORATION_ADD:
    case COLLABORATION_UPDATE:
    case COLLABORATION_DELETE:
    case MODEL_ADD:
    case CONTENT_ADD:
    default:
      return state;
  }
}