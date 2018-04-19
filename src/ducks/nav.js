import {LOGOUT} from 'ducks/user';


export const INIT_END         = 'app/nav/INIT_END';
export const SHOW_ALERT       = 'app/nav/SHOW_ALERT';
export const CLOSE_ALERT      = 'app/nav/CLOSE_ALERT';
export const SHOW_MODAL       = 'app/nav/SHOW_MODAL';
export const CLOSE_MODAL      = 'app/nav/CLOSE_MODAL';
export const SET_CURRENT_PAGE = 'app/nav/SET_CURRENT_PAGE';

export const PAGE_NO_SITES      = 'app/nav/pages/PAGE_NO_SITES';
export const PAGE_MODELS        = 'app/nav/pages/PAGE_MODELS';
export const PAGE_MODELS_ITEM   = 'app/nav/pages/PAGE_MODELS_ITEM';
export const PAGE_CONTENT       = 'app/nav/pages/PAGE_CONTENT';
export const PAGE_CONTENT_ITEM  = 'app/nav/pages/PAGE_CONTENT_ITEM';
export const PAGE_API           = 'app/nav/pages/PAGE_API';
export const PAGE_SETTINGS      = 'app/nav/pages/PAGE_SETTINGS';
export const PAGE_SHARING       = 'app/nav/pages/PAGE_SHARING';
export const PAGE_PROFILE       = 'app/nav/pages/PAGE_PROFILE';

export const MODAL_TYPE_FIELD         = 'app/nav/modals/MODAL_TYPE_FIELD';
export const MODAL_TYPE_MEDIA         = 'app/nav/modals/MODAL_TYPE_MEDIA';
export const MODAL_TYPE_REFERENCE     = 'app/nav/modals/MODAL_TYPE_REFERENCE';
export const MODAL_TYPE_WYSIWYG       = 'app/nav/modals/MODAL_TYPE_WYSIWYG';
export const MODAL_TYPE_MARKDOWN      = 'app/nav/modals/MODAL_TYPE_MARKDOWN';
export const MODAL_TYPE_MODEL_CHOOSE  = 'app/nav/modals/MODAL_TYPE_MODEL_CHOOSE';


export const EMAIL_VERIFY_URL = 'email-verify';
export const PASSWORD_SET_URL = 'password-set';
export const PASSWORD_SUCCESS_URL = 'password-set-success';
export const INVALID_LINK_URL = 'invalid-link';
export const SIGN_URL = 'sign';
export const USERSPACE_URL = 'userspace';
export const SITE_URL = 'site~';
export const MODELS_URL = 'models';
export const MODEL_URL = 'model~';
export const CONTENT_URL = 'content';
export const ITEM_URL = 'item~';
export const API_URL = 'api';
export const SETTINGS_URL = 'settings';
export const SHARING_URL = 'sharing';
export const PROFILE_URL = 'profile';

export const EMAIL_URLS = [EMAIL_VERIFY_URL, PASSWORD_SET_URL, PASSWORD_SUCCESS_URL, INVALID_LINK_URL];


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

export function setCurrentPage(openedPage) {
  return {
    type: SET_CURRENT_PAGE,
    openedPage
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
    
    case SET_CURRENT_PAGE:
      return {
        ...state,
        openedPage: action.openedPage
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
