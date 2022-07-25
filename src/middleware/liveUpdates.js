import {FIELD_DELETE, MODEL_ADD, MODEL_DELETE, SITE_ADD, SITE_DELETE} from "ducks/models";
import {subscribeToContentItem, loadNewSiteContentItems} from "ducks/content";
import {LOAD_NEW_SITE_ITEMS as LOAD_NEW_SITE_ITEMS_media, loadNewSiteMediaItems} from "ducks/media";
import {closeModal, showAlert, URL_SITE, URL_USERSPACE, MODAL_TYPE_FIELD} from "ducks/nav";
import {ALERT_TYPE_ALERT} from "components/modals/AlertModal/AlertModal";


const subscribeToNewModelContent = store => next => action => {
  next(action);

  if (action.type == MODEL_ADD) {
    subscribeToContentItem(action.model);
  }
};

const loadNewSiteContent = store => next => action => {
  next(action);

  if (action.type == SITE_ADD && action.fromServer) {
    next(loadNewSiteMediaItems(action.site));
  }

  if (action.type == LOAD_NEW_SITE_ITEMS_media) {
    next(loadNewSiteContentItems(action.site));
  }
};

const controlRemoving = store => next => action => {
  if (action.type == SITE_DELETE &&
      action.fromServer &&
      store.getState().models.currentSite == action.site) {

    const title = action.isLeave ?
      `The site <strong>${action.site.name}</strong> is no longer available` :
      `The site <strong>${action.site.name}</strong> was deleted`;
    const description = action.isLeave ?
      `You just excluded from the collaborators list of the site. Press OK to go to another site.` :
      `Someone just deleted the current site. Press OK to go to another site.`;

    next(showAlert({
      type: ALERT_TYPE_ALERT,
      title,
      description,
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
        const history = store.getState().nav.history;
        history.push(`/${URL_USERSPACE}/${URL_SITE}${action.model.site.nameId}`);
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

export default [subscribeToNewModelContent, loadNewSiteContent, controlRemoving];
