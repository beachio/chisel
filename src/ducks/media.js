import {Parse} from 'parse';

import {MediaItemData} from 'models/MediaItemData';
import {store} from 'index';


export const INIT_END       = 'app/media/INIT_END';
export const POST_INIT_END  = 'app/media/POST_INIT_END';
export const ITEM_ADD       = 'app/media/ITEM_ADD';
export const ITEM_UPDATE    = 'app/media/ITEM_UPDATE';
export const ITEM_DELETE    = 'app/media/ITEM_DELETE';


function requestMedia() {
  return new Promise((resolve, reject) => {
    new Parse.Query(MediaItemData.OriginClass)
      .find()
      .then(items_o => {
        let items = [];
        for (let item_o of items_o) {
          let item = new MediaItemData().setOrigin(item_o);
          items.push(item);
        }
        resolve(items);
      }, reject);
  });
}

export function init() {
  return dispatch => {
    requestMedia()
      .then(items =>
        dispatch({
          type: INIT_END,
          items
        })
      );
  };
}

export function postInit() {
  let items = store.getState().media.items;
  for (let item of items) {
    item.postInit();
  }
  
  return {
    type: POST_INIT_END
  };
}

export function addMediaItem(file, name, type, cItem = null) {
  let item = new MediaItemData();

  item.file = file;
  item.name = name;
  if (type)
    item.type = type;
  item.contentItem = cItem;

  item.updateOrigin();
  item.origin.save();
  
  return {
    type: ITEM_ADD,
    item
  };
}

export function updateMediaItem(item) {
  item.updateOrigin();
  item.origin.save();
  
  return {
    type: ITEM_UPDATE,
    item
  };
}

export function removeMediaItem(item) {
  item.origin.destroy();
  
  return {
    type: ITEM_DELETE,
    item
  };
}

const initialState = {
  items: []
};

export default function mediaReducer(state = initialState, action) {
  let items = state.items;
  
  switch (action.type) {
    case INIT_END:
      return {
        ...state,
        items: action.items
      };
  
    case ITEM_ADD:
      items.push(action.item);
      return {
        ...state,
        items
      };
  
    case ITEM_DELETE:
      items.splice(items.indexOf(action.item), 1);
      return {
        ...state,
        items
      };
  
    case ITEM_UPDATE:
    case POST_INIT_END:
      return {...state};
      
    default:
      return state;
  }
}