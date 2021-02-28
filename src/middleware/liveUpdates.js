import {browserHistory} from "react-router";

import {FIELD_DELETE, MODEL_ADD, MODEL_DELETE, SITE_DELETE} from "ducks/models";
import {subscribeToContentItem} from "ducks/content";
import {closeModal, showAlert, URL_SITE, URL_USERSPACE, MODAL_TYPE_FIELD} from "ducks/nav";
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
      title: `The site <strong>${action.site.name}</strong> was deleted`,
      type: ALERT_TYPE_ALERT,
      description: "Someone just deleted the current site. Press OK to go to another site.",
      callback: () => next(action)
    }));
  } else {
    next(action);
  }

  if (action.type == MODEL_DELETE &&
      store.getState().models.currentModel == action.model) {
    next(showAlert({
      title: `The model <strong>${action.model.name}</strong> was deleted`,
      type: ALERT_TYPE_ALERT,
      description: "Someone just deleted the current model. Press OK to return to models' list.",
      callback: () => {
        browserHistory.push(`/${URL_USERSPACE}/${URL_SITE}${action.model.site.nameId}`);
      }
    }));
  }

  if (action.type == FIELD_DELETE) {
    const {nav} = store.getState();
    if (nav.modalShowing &&
        nav.modalType == MODAL_TYPE_FIELD &&
        nav.modalParams == action.field) {
      next(closeModal());
      next(showAlert({
        title: `The field <strong>${action.field.name}</strong> was deleted`,
        type: ALERT_TYPE_ALERT,
        description: "Someone just deleted the field you're edited. Press OK to return to field's list."
      }));
    }
  }
};
