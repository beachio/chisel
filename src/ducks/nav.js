
import {LOGOUT} from 'ducks/user';
import {SITE_ADDING_PROBLEM as SITE_ADDING_PROBLEM_models} from "ducks/models";
import {INIT_END as INIT_END_pay} from "ducks/pay";


export const LOCATION_CHANGE      = 'app/nav/LOCATION_CHANGE';
export const INIT_END             = 'app/nav/INIT_END';
export const SHOW_ALERT           = 'app/nav/SHOW_ALERT';
export const CLOSE_ALERT          = 'app/nav/CLOSE_ALERT';
export const SHOW_MODAL           = 'app/nav/SHOW_MODAL';
export const CLOSE_MODAL          = 'app/nav/CLOSE_MODAL';
export const SHOW_NOTIFICATION    = 'app/nav/SHOW_NOTIFICATION';
export const CLOSE_NOTIFICATION   = 'app/nav/CLOSE_NOTIFICATION';
export const RETURN_HOME          = 'app/nav/RETURN_HOME';
export const TOGGLE_SIDEBAR       = 'app/nav/TOGGLE_SIDEBAR';
export const SET_SERVER_PROBLEM_A = 'app/nav/SET_SERVER_PROBLEM_A';
export const SET_SERVER_PROBLEM_B = 'app/nav/SET_SERVER_PROBLEM_B';

export const MODAL_TYPE_SITE            = 'app/nav/modals/MODAL_TYPE_SITE';
export const MODAL_TYPE_FIELD           = 'app/nav/modals/MODAL_TYPE_FIELD';
export const MODAL_TYPE_MEDIA           = 'app/nav/modals/MODAL_TYPE_MEDIA';
export const MODAL_TYPE_REFERENCE       = 'app/nav/modals/MODAL_TYPE_REFERENCE';
export const MODAL_TYPE_WYSIWYG         = 'app/nav/modals/MODAL_TYPE_WYSIWYG';
export const MODAL_TYPE_MARKDOWN        = 'app/nav/modals/MODAL_TYPE_MARKDOWN';
export const MODAL_TYPE_MODEL_CHOOSE    = 'app/nav/modals/MODAL_TYPE_MODEL_CHOOSE';
export const MODAL_TYPE_ROLE            = 'app/nav/modals/MODAL_TYPE_ROLE';
export const MODAL_TYPE_AI_PROMPT       = 'app/nav/modals/MODAL_TYPE_AI_PROMPT';

export const NOTIFICATION_TYPE_NEW_DATA = 'app/nav/notification/NOTIFICATION_TYPE_NEW_DATA';


export const URL_EMAIL_VERIFY     = 'email-verify';
export const URL_PASSWORD_SET     = 'password-set';
export const URL_PASSWORD_SUCCESS = 'password-set-success';
export const URL_INVALID_LINK     = 'invalid-link';
export const URL_SIGN             = 'sign';
export const URL_USERSPACE        = 'userspace';
export const URL_SITE             = 'site~';
export const URL_MODELS           = 'models';
export const URL_MODEL            = 'model~';
export const URL_CONTENT          = 'content';
export const URL_ITEM             = 'item~';
export const URL_API              = 'api';
export const URL_SETTINGS         = 'settings';
export const URL_SHARING          = 'sharing';
export const URL_PROFILE          = 'profile';
export const URL_PAY_PLANS        = 'pay-plans';
export const URL_PAYMENT_METHODS  = 'payment-methods';


export const URLS_EMAIL = [URL_EMAIL_VERIFY, URL_PASSWORD_SET, URL_PASSWORD_SUCCESS, URL_INVALID_LINK];

export function changeLocation(location, navigate, navigationType, params) {
  return {
    type: LOCATION_CHANGE,
    location,
    navigate,
    navigationType,
    params
  };
}

export function toggleSidebar() {
  return {
    type: TOGGLE_SIDEBAR
  };
}

export function initEnd() {
  return {
    type: INIT_END
  };
}

export function showAlert(params) {
  return {
    type: SHOW_ALERT,
    params
  };
}
export function closeAlert() {
  return {
    type: CLOSE_ALERT
  };
}

export function showModal(modalType, params) {
  return {
    type: SHOW_MODAL,
    modalType,
    params
  };
}
export function closeModal() {
  return {
    type: CLOSE_MODAL
  };
}

export function showNotification(notification) {
  return {
    type: SHOW_NOTIFICATION,
    notification
  };
}

export function closeNotification(notificationType) {
  return {
    type: CLOSE_NOTIFICATION,
    notificationType
  };
}

export function returnHome() {
  return {
    type: RETURN_HOME
  };
}

export function setServerProblemA (value = true) {
  return {
    type: SET_SERVER_PROBLEM_A,
    value
  };
}

export function setServerProblemB (value = true) {
  return {
    type: SET_SERVER_PROBLEM_B,
    value
  };
}

const initialState = {
  initEnded: false,

  navigate: null,
  pathname: null,

  isSidebarVisible: true,

  alertShowing: false,
  alertParams: null,

  modalShowing: false,
  modalType: null,
  modalParams: null,

  showUnpaidSub: false,

  notification: null,

  serverProblemA: false,
  serverProblemB: false
};

export default function navReducer(state = initialState, action) {
  switch (action.type) {
    case INIT_END_pay:
      return {
        ...state,
        showUnpaidSub: action.unpaidSub
      };

    case INIT_END:
      return {
        ...state,
        initEnded: true,
        alertShowing: false,
        alertParams: null
      };

    case TOGGLE_SIDEBAR:
      return {
        ...state,
        isSidebarVisible: !state.isSidebarVisible
      };

    case LOGOUT:
      return {
        ...state,
        initEnded: false
      };

    case RETURN_HOME:
      return {
        ...state,
      };

    case SHOW_ALERT:
      if (state.alertShowing &&
          JSON.stringify(action.params) == JSON.stringify(state.alertParams))
        return state;
      return {
        ...state,
        alertShowing: true,
        alertParams: action.params
      };

    case CLOSE_ALERT:
      return {
        ...state,
        alertShowing: false
      };

    case SHOW_MODAL:
      if (state.modalShowing &&
          action.modalType == state.modalType &&
          JSON.stringify(action.params) == JSON.stringify(state.modalParams))
        return state;
      return {
        ...state,
        modalShowing: true,
        modalType: action.modalType,
        modalParams: action.params
      };

    case CLOSE_MODAL:
      return {
        ...state,
        modalShowing: false
      };

    case SHOW_NOTIFICATION:
      if (JSON.stringify(action.notification) == JSON.stringify(state.notification))
        return state;
      return {
        ...state,
        notification: action.notification
      };

    case CLOSE_NOTIFICATION:
      if (!state.notification ||
          action.notificationType && action.notificationType != state.notification?.type)
        return state;
      return {
        ...state,
        notification: null
      };

    case LOCATION_CHANGE:
      return {
        ...state,
        navigate: action.navigate,
        pathname: action.location.pathname,
        alertShowing: false,
        modalShowing: false,
        notification: null
      };


    case SET_SERVER_PROBLEM_A:
      return {...state, serverProblemA: action.value};

    case SET_SERVER_PROBLEM_B:
      return {...state, serverProblemB: action.value};

    case SITE_ADDING_PROBLEM_models:
      return {...state, serverProblemB: true};

    default:
      return state;
  }
}
