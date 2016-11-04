import {Parse} from 'parse';

import {store} from '../index';
import {ContentItemData} from 'models/ContentData';


export const INIT_END           = 'app/content/INIT_END';
export const ITEM_ADD           = 'app/content/ITEM_ADD';
export const ITEM_UPDATED       = 'app/content/ITEM_UPDATED';
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
      }, reject);
  });
}

export function init() {
  return dispatch => {
    let items = [];
    
    let sites = store.getState().models.sites;
    
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

export function addItem(item) {
  let currentSite = store.getState().models.currentSite;
  let model = currentSite.models[0];
  
  item.model = model;
  item.updateOrigin();
  item.origin.save();
  
  return {
    type: ITEM_ADD,
    item
  };
}

export function updateItem(item) {
  item.updateOrigin();
  item.origin.save();
  
  return {
    type: ITEM_UPDATED
  };
}

export function setCurrentItem(currentItem) {
  return {
    type: SET_CURRENT_ITEM,
    currentItem
  };
}

const initialState = {
  items: [],
  currentItem: null
};

export default function contentReducer(state = initialState, action) {
  switch (action.type) {
    case INIT_END:
      return {
        ...state,
        items: action.items
      };
  
    case ITEM_ADD:
      let items = state.items;
      items.push(action.item);
      return {
        ...state,
        items
      };
  
    case SET_CURRENT_ITEM:
      return {
        ...state,
        currentItem: action.currentItem,
      };
      
    default:
      return state;
  }
}