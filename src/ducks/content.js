import {Parse} from 'parse';

import {store} from '../index';
import {ContentItemData} from 'models/ContentData';
import {SITE_DELETE, MODEL_DELETE, FIELD_ADD, FIELD_UPDATE, FIELD_DELETE} from 'ducks/models';
import {LOGOUT} from './user';
import {getRandomColor} from 'utils/common';
import {getContentForModel, getContentForSite} from 'utils/data';


export const INIT_END           = 'app/content/INIT_END';
export const ITEM_ADD           = 'app/content/ITEM_ADD';
export const ITEM_UPDATE        = 'app/content/ITEM_UPDATE';
export const ITEM_DELETE        = 'app/content/ITEM_DELETE';
export const SET_CURRENT_ITEM   = 'app/content/SET_CURRENT_ITEM';

function requestContentItems(model, items) {
  return new Promise((resolve, reject) => {
    new Parse.Query(Parse.Object.extend(model.tableName))
      .find()
      .then(items_o => {
        for (let item_o of items_o) {
          let item = new ContentItemData();
          item.model = model;
          item.setOrigin(item_o);
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
    let promises = [];
    
    for (let site of sites) {
      for (let model of site.models) {
        promises.push(requestContentItems(model, items));
      }
    }
  
    Promise.all(promises)
      .then(() =>
        dispatch({
          type: INIT_END,
          items
        })
      );
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
  item.updateOrigin();
  item.origin.save();
  
  return {
    type: ITEM_UPDATE
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
    
    },
    error: error => {
      console.log(error);
    }
  });
  
  return {
    type: ITEM_DELETE,
    item
  };
  
}

const initialState = {
  items: [],
  currentItem: null
};

export default function contentReducer(state = initialState, action) {
  let items, delItems;
  switch (action.type) {
    case INIT_END:
      for (let item of action.items)
        item.postInit(action.items);
      return {
        ...state,
        items: action.items
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
      return {...state};
      
    case ITEM_DELETE:
      items = state.items;
      items.splice(items.indexOf(action.item), 1);
      return {
        ...state,
        items
      };
  
    case MODEL_DELETE:
      items = state.items;
      delItems = getContentForModel(action.model);
      for (let item of delItems)
        items.splice(items.indexOf(item), 1);
      
      return {
        ...state,
        items
      };
  
    case SITE_DELETE:
      items = state.items;
      delItems = getContentForSite(action.site);
      for (let item of delItems)
        items.splice(items.indexOf(item), 1);
    
      return {
        ...state,
        items
      };
      
    case FIELD_ADD:
    case FIELD_UPDATE:
    case FIELD_DELETE:
      let model = action.field.model;
      items = state.items;
      for (let item of items) {
        if (item.model == model)
          item.model = model;   //updating model: this is a setter
      }
  
      return {
        ...state,
        items
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