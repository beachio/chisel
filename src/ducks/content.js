import {Parse} from 'parse';

import {store} from '../index';
import {ContentItemData, STATUS_ARCHIEVED, STATUS_UPDATED, STATUS_PUBLISHED, STATUS_DRAFT} from 'models/ContentData';
import {SITE_DELETE, MODEL_DELETE, FIELD_ADD, FIELD_UPDATE, FIELD_DELETE} from 'ducks/models';
import {LOGOUT} from './user';
import {getRandomColor} from 'utils/common';
import {getContentForModel, getContentForSite} from 'utils/data';


export const INIT_END           = 'app/content/INIT_END';
export const ITEM_ADD           = 'app/content/ITEM_ADD';
export const ITEM_UPDATE        = 'app/content/ITEM_UPDATE';
export const ITEM_PUBLISH       = 'app/content/ITEM_PUBLISH';
export const ITEM_DISCARD       = 'app/content/ITEM_DISCARD';
export const ITEM_ARCHIEVE      = 'app/content/ITEM_ARCHIEVE';
export const ITEM_DELETE        = 'app/content/ITEM_DELETE';
export const SET_CURRENT_ITEM   = 'app/content/SET_CURRENT_ITEM';

function requestContentItems(model, items, itemsDraft) {
  return new Promise((resolve, reject) => {
    new Parse.Query(Parse.Object.extend(model.tableName))
      .find()
      .then(items_o => {
        for (let item_o of items_o) {
          let item = new ContentItemData();
          item.model = model;
          item.setOrigin(item_o);
          if (item_o.get('t__owner'))
            itemsDraft.push(item);
          else
            items.push(item);
        }
        resolve();
      }, resolve);
  });
}

export function init() {
  return dispatch => {
    let sites = store.getState().models.sites;
    let items = [];
    let itemsDraft = [];
    let promises = [];
    
    for (let site of sites) {
      for (let model of site.models) {
        promises.push(requestContentItems(model, items, itemsDraft));
      }
    }
  
    Promise.all(promises)
      .then(() => {
        dispatch({
          type: INIT_END,
          items,
          itemsDraft
        });
      });
  };
}

//we need wait for server to get item id
export function addItem(item) {
  return dispatch => {
    item.color = getRandomColor();
  
    item.updateOrigin();
    item.origin.save()
      .then(() => {
        dispatch({
          type: ITEM_ADD,
          item
        });
      });
  }
}

export function updateItem(item) {
  if (item.status == STATUS_PUBLISHED)
    item.status = STATUS_UPDATED;
  
  item.updateOrigin();
  item.origin.save();
  
  return {
    type: ITEM_UPDATE
  };
}

export function publishItem(item) {
  let itemD = item.draft;
  if (!itemD) {
    itemD = new ContentItemData();
    itemD.model = item.model;
    itemD.title = item.title;
    itemD.color = item.color;
    itemD.fields = new Map(item.fields);
    itemD.owner = item;
  
    itemD.updateOrigin();
    
    item.draft = itemD;
    
  } else {
    item.fields = new Map(itemD.fields);
  }
  
  item.status = STATUS_PUBLISHED;
  
  item.updateOrigin();
  
  itemD.origin.save()
    .then(() => item.origin.save())
    .then(() => Parse.Cloud.run('onContentModify'));
  
  return {
    type: ITEM_PUBLISH,
    item
  };
}

export function discardItem(item) {
  if (item.status == STATUS_UPDATED) {
    item.status = STATUS_PUBLISHED;
    item.updateOrigin();
    item.origin.save();
  }
  
  if (item.draft) {
    item.draft.fields = new Map(item.fields);
    item.draft.updateOrigin();
    item.draft.save();
  }
  
  return {
    type: ITEM_ARCHIEVE,
    item
  };
}

export function archieveItem(item) {
  let oldStatus = item.status;
  item.status = STATUS_ARCHIEVED;
  
  item.updateOrigin();
  item.origin.save()
    .then(() => {
      if (oldStatus == STATUS_PUBLISHED)
        Parse.Cloud.run('onContentModify');
    });
  
  return {
    type: ITEM_ARCHIEVE,
    item
  };
}

export function setCurrentItem(currentItem) {
  return {
    type: SET_CURRENT_ITEM,
    currentItem
  };
}

export function deleteItem(item) {
  //item.origin.destroy();
  
  Parse.Cloud.run('deleteContentItem', {
    tableName: item.model.tableName,
    itemId: item.origin.id,
  }, {
    success: status => {
      Parse.Cloud.run('onContentModify');
    },
    error: console.log
  });
  
  return {
    type: ITEM_DELETE,
    item
  };
  
}

const initialState = {
  items: [],
  itemsDraft: [],
  
  currentItem: null
};

export default function contentReducer(state = initialState, action) {
  let items, itemsDraft, delItems;
  switch (action.type) {
    case INIT_END:
      items = action.items;
      itemsDraft = action.itemsDraft;
      
      for (let item of items)
        item.postInit(items);
      for (let item of itemsDraft)
        item.postInit(items);
  
      for (let itemD of itemsDraft) {
        let item_o = itemD.origin.get('t__owner');
        for (let item of items) {
          if (item.origin.id == item_o.id) {
            item.draft = itemD;
            itemD.owner = item;
            break;
          }
        }
      }
      
      return {
        ...state,
        items,
        itemsDraft
      };
  
    case SET_CURRENT_ITEM:
      return {
        ...state,
        currentItem: action.currentItem,
      };
  
    case ITEM_ADD:
      items = state.items;
      items.push(action.item);
      return {
        ...state,
        items
      };
      
    case ITEM_UPDATE:
    case ITEM_PUBLISH:
    case ITEM_DISCARD:
    case ITEM_ARCHIEVE:
      return {...state};
      
    case ITEM_DELETE:
      let item = action.item;
      items = state.items;
      itemsDraft = state.itemsDraft;
      
      items.splice(items.indexOf(item), 1);
      if (item.draft)
        itemsDraft.splice(itemsDraft.indexOf(item.draft), 1);
      
      return {
        ...state,
        items,
        itemsDraft
      };
  
    case MODEL_DELETE:
      items = state.items;
      itemsDraft = state.itemsDraft;
      
      delItems = getContentForModel(action.model);
      for (let item of delItems) {
        items.splice(items.indexOf(item), 1);
        if (item.draft)
          itemsDraft.splice(itemsDraft.indexOf(item.draft), 1);
      }
      
      return {
        ...state,
        items,
        itemsDraft
      };
  
    case SITE_DELETE:
      items = state.items;
      itemsDraft = state.itemsDraft;
      
      delItems = getContentForSite(action.site);
      for (let item of delItems) {
        items.splice(items.indexOf(item), 1);
        if (item.draft)
          itemsDraft.splice(itemsDraft.indexOf(item.draft), 1);
      }
    
      return {
        ...state,
        items,
        itemsDraft
      };
      
    case FIELD_ADD:
    case FIELD_UPDATE:
    case FIELD_DELETE:
      items = state.items;
      itemsDraft = state.itemsDraft;
      
      let model = action.field.model;
      for (let item of items) {
        if (item.model == model)
          item.model = model;   //updating model: this is a setter
      }
      for (let item of itemsDraft) {
        if (item.model == model)
          item.model = model;   //updating model: this is a setter
      }
  
      return {
        ...state,
        items,
        itemsDraft
      };
  
    case LOGOUT:
      return {
        ...state,
        currentItem: null
      };
      
    default:
      return state;
  }
}