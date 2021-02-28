import {Parse} from 'parse';

import {store} from '../index';
import {ContentItemData, STATUS_ARCHIVED, STATUS_UPDATED, STATUS_PUBLISHED, STATUS_DRAFT} from 'models/ContentData';
import {
  SITE_DELETE,
  MODEL_DELETE,
  FIELD_ADD,
  FIELD_UPDATE,
  FIELD_DELETE,
} from 'ducks/models';
import {LOGOUT} from './user';
import {getRandomColor} from 'utils/common';
import {getContentForModel, getContentForSite, getModelFromAnySite} from 'utils/data';
import {send, getAllObjects} from 'utils/server';


export const INIT_END           = 'app/content/INIT_END';
export const ITEM_ADD           = 'app/content/ITEM_ADD';
export const ITEM_UPDATE        = 'app/content/ITEM_UPDATE';
export const ITEM_PUBLISH       = 'app/content/ITEM_PUBLISH';
export const ITEM_DISCARD       = 'app/content/ITEM_DISCARD';
export const ITEM_ARCHIVE       = 'app/content/ITEM_ARCHIVE';
export const ITEM_RESTORE       = 'app/content/ITEM_RESTORE';
export const ITEM_DELETE        = 'app/content/ITEM_DELETE';
export const SET_CURRENT_ITEM   = 'app/content/SET_CURRENT_ITEM';
export const FILTER_MODEL       = 'app/content/FILTER_MODEL';
export const FILTER_STATUS      = 'app/content/FILTER_STATUS';

function requestContentItems(model, items, itemsDraft) {
  return send(getAllObjects(
    new Parse.Query(Parse.Object.extend(model.tableName))
  ))
    .then(items_o => {
      for (let item_o of items_o) {
        let item = new ContentItemData(model);
        item.setOrigin(item_o);
        if (item_o.get('t__owner'))
          itemsDraft.push(item);
        else
          items.push(item);
      }
    })
    .catch(() => {});
}

export async function subscribeToContentItem(model) {
  const query = new Parse.Query(Parse.Object.extend(model.tableName));
  const subscription = await query.subscribe();

  subscription.on('create', (item_o) => {
    const {items, itemsDraft} = store.getState().content;
    if (items.find(i => i.origin.id == item_o.id)
      || itemsDraft.find(i => i.origin.id == item_o.id))
      return;

    const model_o = item_o.get('t__model');
    const model = getModelFromAnySite(model_o.id);

    let item = new ContentItemData(model);
    item.setOrigin(item_o);
    item.postInit(items);

    const owner_o = item_o.get('t__owner');
    if (owner_o) {
      const owner = items.find(i => i.origin.id == owner_o.id);
      if (owner) {
        owner.draft = item;
        item.owner = owner;
      }
    }
    store.dispatch(addItemFromServer(item, !!owner_o));
  });

  subscription.on('update', (itemNew_o) => {
    const {items, itemsDraft} = store.getState().content;
    let item = items.find(i => i.origin.id == itemNew_o.id);
    if (!item)
      item = itemsDraft.find(i => i.origin.id == itemNew_o.id);
    if (!item)
      return;

    const itemNew = new ContentItemData(item.model);
    itemNew.setOrigin(itemNew_o);
    itemNew.postInit(items);

    if (JSON.stringify(itemNew) == JSON.stringify(item))
      return;

    item.color = itemNew.color;
    item.status = itemNew.status;
    item.fields = itemNew.fields;

    store.dispatch(updateItemFromServer(item));
  });

  subscription.on('delete', (item_o) => {
    const {items} = store.getState().content;
    const item = items.find(i => i.origin.id == item_o.id);
    if (!item)
      return;

    store.dispatch(deleteItemFromServer(item));
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
        subscribeToContentItem(model);
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
    send(item.origin.save())
      .then(() => {
        dispatch({
          type: ITEM_ADD,
          item
        });
      });
  }
}

export function addItemFromServer(item, isDraft) {
  return {
    type: ITEM_ADD,
    item,
    isDraft
  };
}

export function updateItem(item) {
  if (item.draft) {
    item.draft.updateOrigin();
    send(item.draft.origin.save());

    if (item.status == STATUS_ARCHIVED)
      item.fields = new Map(item.draft.fields);
  }

  if (item.status == STATUS_PUBLISHED)
    item.status = STATUS_UPDATED;

  item.updateOrigin();
  send(item.origin.save());

  return {
    type: ITEM_UPDATE,
    item
  };
}

export function updateItemFromServer(item) {
  return {
    type: ITEM_UPDATE,
    item
  };
}

export function publishItem(item) {
  return dispatch => {
    let itemD = item.draft;
    let isNewDraft = !itemD;
    if (isNewDraft) {
      itemD = new ContentItemData(item.model);
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

    send(itemD.origin.save())
      .then(() => {
        dispatch({
          type: ITEM_PUBLISH,
          item,
          isNewDraft
        });
        send(item.origin.save());

      })
      .then(() => {
        if (!item.model.site.webhookDisabled)
          send(Parse.Cloud.run('onContentModify', {URL: item.model.site.webhook}));
      });
  }
}

export function discardItem(item) {
  if (item.status == STATUS_UPDATED)
    item.status = STATUS_PUBLISHED;

  item.updateOrigin();
  send(item.origin.save());

  if (item.draft) {
    item.draft.fields = new Map(item.fields);
    item.draft.updateOrigin();
    send(item.draft.origin.save());
  }

  return {
    type: ITEM_DISCARD,
    item
  };
}

export function archiveItem(item) {
  let callWebhook = item.status == STATUS_PUBLISHED  &&  !item.model.site.webhookDisabled;
  item.status = STATUS_ARCHIVED;

  if (item.draft)
    item.fields = new Map(item.draft.fields);

  item.updateOrigin();
  send(item.origin.save())
    .then(() => {
      if (callWebhook)
        send(Parse.Cloud.run('onContentModify', {URL: item.model.site.webhook}));
    });

  return {
    type: ITEM_ARCHIVE,
    item
  };
}

export function restoreItem(item) {
  item.status = STATUS_DRAFT;

  item.updateOrigin();
  send(item.origin.save());

  return {
    type: ITEM_RESTORE,
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
  send(Parse.Cloud.run('deleteContentItem', {
    tableName: item.model.tableName,
    itemId: item.origin.id,
  }))
    .then(() => {
      if (!item.model.site.webhookDisabled)
        send(Parse.Cloud.run('onContentModify', {URL: item.model.site.webhook}));
    });

  return {
    type: ITEM_DELETE,
    item
  };
}

function deleteItemFromServer(item) {
  item.deleted = true;

  return {
    type: ITEM_DELETE,
    item
  };
}

export function filterModel(model) {
  return {
    type: FILTER_MODEL,
    model
  };
}

export function filterStatus(status) {
  return {
    type: FILTER_STATUS,
    status
  };
}

const initialState = {
  items: [],
  itemsDraft: [],

  filteredModels: new Set(),
  filteredStatuses: new Set(),

  currentItem: null
};

export default function contentReducer(state = initialState, action) {
  let item, items, itemsDraft, delItems;
  switch (action.type) {
    case INIT_END:
      items = action.items;
      itemsDraft = action.itemsDraft;

      for (let item of items)
        item.postInit(items);
      for (let item of itemsDraft)
        item.postInit(items);

      for (let itemD of itemsDraft) {
        const item_o = itemD.origin.get('t__owner');
        const item = items.find(i => i.origin.id == item_o.id);
        if (item) {
          item.draft = itemD;
          itemD.owner = item;
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
      if (action.isDraft)
        items = state.itemsDraft;
      else
        items = state.items;

      if (!items.find(i => i.origin.id == action.item.origin.id))
        items.push(action.item);

      if (action.isDraft)
        return {
          ...state,
          itemsDraft: items
        };
      else
        return {
          ...state,
          items
        };

    case ITEM_UPDATE:
    case ITEM_DISCARD:
    case ITEM_ARCHIVE:
    case ITEM_RESTORE:
      return {...state};

    case ITEM_PUBLISH:
      if (!action.isNewDraft)
        return {...state};

      itemsDraft = state.itemsDraft;
      itemsDraft.push(action.item.draft);

      return {
        ...state,
        itemsDraft
      };

    case ITEM_DELETE:
      item = action.item;
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

    case FILTER_MODEL:
      let {filteredModels} = state;
      let newFM = new Set(filteredModels);
      if (filteredModels.has(action.model))
        newFM.delete(action.model);
      else
        newFM.add(action.model);
      return {
        ...state,
        filteredModels: newFM
      };

    case FILTER_STATUS:
      let {filteredStatuses} = state;
      let newFS = new Set(filteredStatuses);
      if (filteredStatuses.has(action.status))
        newFS.delete(action.status);
      else
        newFS.add(action.status);
      return {
        ...state,
        filteredStatuses: newFS
      };

    case FIELD_ADD:
    case FIELD_UPDATE:
    case FIELD_DELETE:
      items = state.items;
      itemsDraft = state.itemsDraft;

      let model = action.field.model;
      for (item of items) {
        if (item.model == model)
          item.updateModel();
      }
      for (item of itemsDraft) {
        if (item.model == model)
          item.updateModel();
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
