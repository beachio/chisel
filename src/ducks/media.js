import {Parse} from 'parse';

import {store} from 'index';
import {MediaItemData} from 'models/MediaItemData';
import {getSite} from 'utils/data';
import {getAllObjects, send} from 'utils/server';


export const INIT_END       = 'app/media/INIT_END';
export const ITEM_ADD       = 'app/media/ITEM_ADD';
export const ITEM_UPDATE    = 'app/media/ITEM_UPDATE';
export const ITEM_DELETE    = 'app/media/ITEM_DELETE';


function requestMedia() {
  let sites = store.getState().models.sites;
  let sites_o = [];
  for (let site of sites)
    sites_o.push(site.origin);
  
  return send(getAllObjects(
    new Parse.Query(MediaItemData.OriginClass)
      .containedIn("site", sites_o)
  ))
    .then(items_o => {
      let items = [];
      for (let item_o of items_o) {
        let item = new MediaItemData().setOrigin(item_o);
        item.site = getSite(item_o.get('site').id);
        items.push(item);
      }

      return items;
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

export function addMediaItem(item) {
  item.updateOrigin();
  send(item.origin.save());
  
  return {
    type: ITEM_ADD,
    item
  };
}

export function updateMediaItem(item) {
  item.updateOrigin();
  send(item.origin.save());
  
  return {
    type: ITEM_UPDATE,
    item
  };
}

export function removeMediaItem(item) {
  send(item.origin.destroy());
  
  return {
    type: ITEM_DELETE,
    item
  };
}

const initialState = {
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
      return {...state};
      
    default:
      return state;
  }
}