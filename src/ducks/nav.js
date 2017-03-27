import {LOCATION_CHANGE} from 'react-router-redux';

import {LOGOUT} from 'ducks/user';


export const INIT_END           = 'app/nav/INIT_END';
export const SHOW_ALERT         = 'app/nav/SHOW_ALERT';
export const CLOSE_ALERT        = 'app/nav/CLOSE_ALERT';
export const SHOW_MODAL         = 'app/nav/SHOW_MODAL';
export const CLOSE_MODAL        = 'app/nav/CLOSE_MODAL';

export const PAGE_MODELS    = 'app/nav/pages/PAGE_MODELS';
export const PAGE_CONTENT   = 'app/nav/pages/PAGE_CONTENT';
export const PAGE_API       = 'app/nav/pages/PAGE_API';
export const PAGE_SETTINGS  = 'app/nav/pages/PAGE_SETTINGS';
export const PAGE_SHARING   = 'app/nav/pages/PAGE_SHARING';

export const MODAL_TYPE_FIELD         = 'app/nav/modals/MODAL_TYPE_FIELD';
export const MODAL_TYPE_MEDIA         = 'app/nav/modals/MODAL_TYPE_MEDIA';
export const MODAL_TYPE_REFERENCE     = 'app/nav/modals/MODAL_TYPE_REFERENCE';
export const MODAL_TYPE_WYSIWYG       = 'app/nav/modals/MODAL_TYPE_WYSIWYG';
export const MODAL_TYPE_MODEL_CHOOSE  = 'app/nav/modals/MODAL_TYPE_MODEL_CHOOSE';


export function initEnd() {
  return {
    type: INIT_END
  }
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

const initialState = {
  initEnded: false,
  
  openedPage: PAGE_MODELS,
  
  alertShowing: false,
  alertParams: null,

  modalShowing: false,
  modalType: null,
  modalParams: null
};

export default function navReducer(state = initialState, action) {
  switch (action.type) {
    case INIT_END:
      return {
        ...state,
        initEnded: true
      };
      
    case LOGOUT:
      return {
        ...state,
        initEnded: false
      };
    
    case LOCATION_CHANGE:
      let URL = action.payload.pathname;
      let openedPage = PAGE_MODELS;
      if (URL.indexOf('content') != -1)
        openedPage = PAGE_CONTENT;
      else if (URL.indexOf('api') != -1)
        openedPage = PAGE_API;
      else if (URL.indexOf('settings') != -1)
        openedPage = PAGE_SETTINGS;
      else if (URL.indexOf('sharing') != -1)
        openedPage = PAGE_SHARING;
      
      return {
        ...state,
        openedPage
      };
  
    case SHOW_ALERT:
      return {...state, alertShowing: true, alertParams: action.params};
  
    case CLOSE_ALERT:
      return {...state, alertShowing: false};

    case SHOW_MODAL:
      return {
        ...state,
        modalShowing: true,
        modalType: action.modalType,
        modalParams: action.params
      };

    case CLOSE_MODAL:
      return {...state, modalShowing: false};
      
    default:
      return state;
  }
}
