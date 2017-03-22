import {SET_CURRENT_SITE} from './models';
import {LOGOUT} from './user';


export const OPEN_PAGE          = 'app/nav/OPEN_PAGE';
export const SHOW_ALERT         = 'app/nav/SHOW_ALERT';
export const CLOSE_ALERT        = 'app/nav/CLOSE_ALERT';
export const SHOW_MODAL         = 'app/nav/SHOW_MODAL';
export const CLOSE_MODAL        = 'app/nav/CLOSE_MODAL';

export const PAGE_MODELS    = 'app/nav/pages/PAGE_MODELS';
export const PAGE_CONTENT   = 'app/nav/pages/PAGE_CONTENT';
export const PAGE_API       = 'app/nav/pages/PAGE_API';
export const PAGE_SETTINGS  = 'app/nav/pages/PAGE_SETTINGS';
export const PAGE_SHARING   = 'app/nav/pages/PAGE_SHARING';

export const MODAL_TYPE_FIELD   = 'app/nav/modals/MODAL_TYPE_FIELD';
export const MODAL_TYPE_MEDIA   = 'app/nav/modals/MODAL_TYPE_MEDIA';
export const MODAL_TYPE_REFERENCE   = 'app/nav/modals/MODAL_TYPE_REFERENCE';
export const MODAL_TYPE_WYSIWYG = 'app/nav/modals/MODAL_TYPE_WYSIWYG';



export function openPage(pageType) {
  return {
    type: OPEN_PAGE,
    pageType
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

const initialState = {
  openedPage: PAGE_MODELS,
  
  alertShowing: false,
  alertParams: null,

  modalShowing: false,
  modalType: null,
  modalParams: null
};

export default function navReducer(state = initialState, action) {
  switch (action.type) {
    case OPEN_PAGE:
      return {
        ...state,
        openedPage: action.pageType
      };
    
    case SET_CURRENT_SITE:
    case LOGOUT:
      return {
        ...state,
        openedPage: PAGE_MODELS
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
