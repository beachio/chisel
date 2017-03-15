import {Parse} from 'parse';

import {store} from '../index';
import {UserData, CollaborationData, ROLE_ADMIN, ROLE_DEVELOPER, ROLE_EDITOR, ROLE_OWNER} from 'models/UserData';


export const COLLABORATION_ADD    = 'app/ACLset/COLLABORATION_ADD';
export const COLLABORATION_UPDATE = 'app/ACLset/COLLABORATION_UPDATE';
export const COLLABORATION_DELETE = 'app/ACLset/COLLABORATION_DELETE';
export const MODEL_ADD            = 'app/ACLset/MODEL_ADD';
export const CONTENT_ADD          = 'app/ACLset/CONTENT_ADD';


function collabModify(collab, deleting = false) {
  let site = collab.site;
  
  //ACL for collaborations
  let collabACL = collab.origin.getACL();
  if (!collabACL)
    collabACL = new Parse.ACL(site.owner.origin);
    
  for (let tempCollab of site.collaborations) {
    //set ACL for every collab
    let tempCollabACL = tempCollab.origin.getACL();
    if (!tempCollabACL)
      tempCollabACL = new Parse.ACL(site.owner.origin);

    let same = tempCollab.user.origin == collab.user.origin;
    
    tempCollabACL.setReadAccess(collab.user.origin, !deleting && collab.role == ROLE_ADMIN);
    tempCollabACL.setWriteAccess(collab.user.origin, !deleting && collab.role == ROLE_ADMIN);

    tempCollab.origin.setACL(tempCollabACL);
    tempCollab.origin.save();

    //set ACL for current collab
    if (!deleting) {
      collabACL.setReadAccess(tempCollab.user.origin, tempCollab.role == ROLE_ADMIN || same);
      collabACL.setWriteAccess(tempCollab.user.origin, tempCollab.role == ROLE_ADMIN || same);
    }
  }
  
  if (!deleting) {
    collab.origin.setACL(collabACL);
    collab.origin.save();
  }
  
  //ACL for site
  let siteACL = site.origin.getACL();
  if (!siteACL)
    siteACL = new Parse.ACL(site.owner.origin);
  
  siteACL.setReadAccess(collab.user.origin, !deleting);
  siteACL.setWriteAccess(collab.user.origin, !deleting && collab.role == ROLE_ADMIN);
  site.origin.setACL(siteACL);
  site.origin.save();
  
  //ACL for models and content items
  let contentItems = store.getState().content.items;
  
  for (let model of site.models) {
    let modelACL = model.origin.getACL();
    if (!modelACL)
      modelACL = new Parse.ACL(site.owner.origin);
    
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