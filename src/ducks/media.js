import {Parse} from 'parse';

import {store} from 'index';
import {MediaItemData} from 'models/MediaItemData';
import {getSite} from 'utils/data';
import {getAllObjects, send} from 'utils/server';


export const INIT_END             = 'app/media/INIT_END';
export const LOAD_NEW_SITE_ITEMS  = 'app/media/LOAD_NEW_SITE_ITEMS';
export const ITEM_ADD             = 'app/media/ITEM_ADD';
export const ITEM_UPDATE          = 'app/media/ITEM_UPDATE';
export const ITEM_DELETE          = 'app/media/ITEM_DELETE';


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

async function subscribeToMedia() {
  const query = new Parse.Query(MediaItemData.OriginClass);
  const subscription = await query.subscribe();

  subscription.on('create', (item_o) => {
    const {items} = store.getState().media;
    if (items.find(i => i.origin.id == item_o.id))
      return;

    const site = getSite(item_o.get('site').id);
    if (!site)
      return;

    const item = new MediaItemData().setOrigin(item_o);
    item.site = site;
    store.dispatch(addMediaItemFromServer(item));
  });

  subscription.on('update', (item_o) => {
    const {items} = store.getState().media;
    let item = items.find(i => i.origin.id == item_o.id);
    if (!item)
      return;

    item.name = item_o.get('name');
    store.dispatch(updateMediaItemFromServer(item));
  });

  const onDelete = (item_o) => {
    const {items} = store.getState().media;
    const item = items.find(i => i.origin.id == item_o.id);
    if (!item)
      return;

    store.dispatch(removeMediaItemFromServer(item));
  };
  subscription.on('delete', onDelete);
  subscription.on('leave', onDelete);
}

export function loadNewSiteMediaItems(site) {
  return dispatch => {
    send(getAllObjects(
      new Parse.Query(MediaItemData.OriginClass)
        .equalTo("site", site.origin)
    ))
      .then(items_o => {
        let items = [];
        for (let item_o of items_o) {
          let item = new MediaItemData().setOrigin(item_o);
          item.site = site;
          items.push(item);
        }

        dispatch({
          type: LOAD_NEW_SITE_ITEMS,
          items,
          site
        });
      });
  }
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
    subscribeToMedia();
  };
}

// only for subscription
export function addMediaItem(item) {
  return dispatch => {
    item.updateOrigin();
    send(item.origin.save())
      .then(() => {
        dispatch({
         type: ITEM_ADD,
         item
        });
      });
  }
}

export function addMediaItemFromServer(item) {
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

export function updateMediaItemFromServer(item) {
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

export function removeMediaItemFromServer(item) {
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
    case LOAD_NEW_SITE_ITEMS:
      items.push(...action.items);
      return {
        ...state,
        items
      };

    case ITEM_ADD:
      if (!items.find(i => i.origin.id == action.item.origin.id))
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
