import {Parse} from 'parse';

import {store} from '../index';
import {ContentItemData} from 'models/ContentData';
import {getRandomColor} from 'utils/common';
import {getContentForModel} from 'utils/data';


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

export function addItem(title) {
  let item = new ContentItemData();
  
  let models = store.getState().models.currentSite.models;
  item.model = models[0];
  
  item.title = title;
  item.color = getRandomColor();
  
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

export function updateModel(model) {
  return dispatch => {
    let items = getContentForModel(model);
    for (let item of items) {
      item.model = model;
      dispatch({
        type: ITEM_UPDATED
      });
    }
  }
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
      
    case ITEM_UPDATED:
      return state;
  
    case SET_CURRENT_ITEM:
      return {
        ...state,
        currentItem: action.currentItem,
      };
      
    default:
      return state;
  }
}