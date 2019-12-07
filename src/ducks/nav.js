import {browserHistory} from "react-router";
import {LOCATION_CHANGE} from 'react-router-redux';


import {LOGOUT} from 'ducks/user';
import {SITE_ADDING_PROBLEM as SITE_ADDING_PROBLEM_models} from "ducks/models";
import {INIT_END as INIT_END_pay} from "ducks/pay";
import {ALERT_TYPE_CONFIRM} from "components/modals/AlertModal/AlertModal";


export const INIT_END             = 'app/nav/INIT_END';
export const SHOW_ALERT           = 'app/nav/SHOW_ALERT';
export const CLOSE_ALERT          = 'app/nav/CLOSE_ALERT';
export const SHOW_MODAL           = 'app/nav/SHOW_MODAL';
export const CLOSE_MODAL          = 'app/nav/CLOSE_MODAL';
export const RETURN_HOME          = 'app/nav/RETURN_HOME';
export const SET_CURRENT_PAGE     = 'app/nav/SET_CURRENT_PAGE';
export const TOGGLE_SIDEBAR       = 'app/nav/TOGGLE_SIDEBAR';
export const SET_SERVER_PROBLEM_A = 'app/nav/SET_SERVER_PROBLEM_A';
export const SET_SERVER_PROBLEM_B = 'app/nav/SET_SERVER_PROBLEM_B';


export const PAGE_NO_SITES        = 'app/nav/pages/PAGE_NO_SITES';
export const PAGE_MODELS          = 'app/nav/pages/PAGE_MODELS';
export const PAGE_MODELS_ITEM     = 'app/nav/pages/PAGE_MODELS_ITEM';
export const PAGE_CONTENT         = 'app/nav/pages/PAGE_CONTENT';
export const PAGE_CONTENT_ITEM    = 'app/nav/pages/PAGE_CONTENT_ITEM';
export const PAGE_API             = 'app/nav/pages/PAGE_API';
export const PAGE_SETTINGS        = 'app/nav/pages/PAGE_SETTINGS';
export const PAGE_SHARING         = 'app/nav/pages/PAGE_SHARING';
export const PAGE_PROFILE         = 'app/nav/pages/PAGE_PROFILE';
export const PAGE_PAY_PLANS       = 'app/nav/pages/PAGE_PAY_PLANS';
export const PAGE_PAYMENT_METHODS = 'app/nav/pages/PAGE_PAYMENT_METHODS';

export const MODAL_TYPE_SITE            = 'app/nav/modals/MODAL_TYPE_SITE';
export const MODAL_TYPE_FIELD           = 'app/nav/modals/MODAL_TYPE_FIELD';
export const MODAL_TYPE_MEDIA           = 'app/nav/modals/MODAL_TYPE_MEDIA';
export const MODAL_TYPE_REFERENCE       = 'app/nav/modals/MODAL_TYPE_REFERENCE';
export const MODAL_TYPE_WYSIWYG         = 'app/nav/modals/MODAL_TYPE_WYSIWYG';
export const MODAL_TYPE_MARKDOWN        = 'app/nav/modals/MODAL_TYPE_MARKDOWN';
export const MODAL_TYPE_MODEL_CHOOSE    = 'app/nav/modals/MODAL_TYPE_MODEL_CHOOSE';
export const MODAL_TYPE_ROLE            = 'app/nav/modals/MODAL_TYPE_ROLE';


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

export function returnHome() {
  browserHistory.push(`/${URL_USERSPACE}`);

  return {
    type: RETURN_HOME
  };
}

export function setCurrentPage(openedPage) {
  return {
    type: SET_CURRENT_PAGE,
    openedPage
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

const initialState = {
  initEnded: false,

  isSidebarVisible: true,
  
  openedPage: PAGE_MODELS,
  
  alertShowing: false,
  alertParams: null,

  modalShowing: false,
  modalType: null,
  modalParams: null,

  showUnpaidSub: false,

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
      let alertShowing = false;
      let alertParams = null;
      if (state.showUnpaidSub) {
        alertShowing = true;
        alertParams = {
          type: ALERT_TYPE_CONFIRM,
          title: `Failed payment`,
          description: `We can't withdraw money for next payment period. Please, update your payment methods.`,
          confirmLabel: 'Open payment methods',
          cancelLabel: 'Close',
          onConfirm: () => browserHistory.push(`/${URL_USERSPACE}/${URL_PAYMENT_METHODS}`)
        };
      }

      return {
        ...state,
        initEnded: true,
        alertShowing,
        alertParams
      };

    case TOGGLE_SIDEBAR:
      return {
        ...state,
        isSidebarVisible: !state.isSidebarVisible
      };

    case LOGOUT:
      return {
        ...state,
        openedPage: PAGE_MODELS,
        initEnded: false
      };
    
    case RETURN_HOME:
      return {
        ...state,
        openedPage: PAGE_MODELS
      };

    case SET_CURRENT_PAGE:
      return {
        ...state,
        openedPage: action.openedPage
      };
  
    case SHOW_ALERT:
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
      return {
        ...state,
        modalShowing: true,
        modalType: action.modalType,
        modalParams: action.params
      };

    case LOCATION_CHANGE:
      return {
        ...state,
        alertShowing: false,
        modalShowing: false
      };

    case CLOSE_MODAL:
      return {...state, modalShowing: false};

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
