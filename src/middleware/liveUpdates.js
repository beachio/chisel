import {browserHistory} from "react-router";

import {MODEL_ADD, MODEL_DELETE, SITE_DELETE} from "ducks/models";
import {subscribeToContentItem} from "ducks/content";
import {showAlert, URL_SITE, URL_USERSPACE} from "ducks/nav";
import {ALERT_TYPE_ALERT} from "components/modals/AlertModal/AlertModal";


export const subscribeToNewModelContent = store => next => action => {
  next(action);

  if (action.type == MODEL_ADD) {
    subscribeToContentItem(action.model);
  }
};

export const controlRemoving = store => next => action => {
  if (action.type == SITE_DELETE &&
      action.fromServer &&
      store.getState().models.currentSite == action.site) {
    next(showAlert({
      title: `Site <strong>${action.site.name}</strong> was deleted`,
      type: ALERT_TYPE_ALERT,
      description: "Someone just deleted the current site. Press OK to return to next site.",
      callback: () => next(action)
    }));
  } else {
    next(action);
  }

  if (action.type == MODEL_DELETE &&
      store.getState().models.currentModel == action.model) {
    next(showAlert({
      title: `Model <strong>${action.model.name}</strong> was deleted`,
      type: ALERT_TYPE_ALERT,
      description: "Someone just deleted the current model. Press OK to return to models' list.",
      callback: () => {
        browserHistory.push(`/${URL_USERSPACE}/${URL_SITE}${action.model.site.nameId}`);
      }
    }));
  }
};
