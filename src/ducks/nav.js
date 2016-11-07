import {store} from '../index';
import {SET_CURRENT_SITE} from './models';


export const OPEN_PAGE          = 'app/nav/OPEN_PAGE';
export const OPEN_MODEL         = 'app/nav/OPEN_MODEL';
export const CLOSE_MODEL        = 'app/nav/CLOSE_MODEL';
export const OPEN_CONTENT_ITEM  = 'app/nav/OPEN_CONTENT_ITEM';
export const CLOSE_CONTENT_ITEM = 'app/nav/CLOSE_CONTENT_ITEM';
export const SHOW_ALERT         = 'app/nav/SHOW_ALERT';
export const CLOSE_ALERT        = 'app/nav/CLOSE_ALERT';
export const SHOW_MODAL         = 'app/nav/SHOW_MODAL';
export const CLOSE_MODAL        = 'app/nav/CLOSE_MODAL';

export const PAGE_MODELS    = 'app/nav/pages/PAGE_MODELS';
export const PAGE_CONTENT   = 'app/nav/pages/PAGE_CONTENT';
export const PAGE_API       = 'app/nav/pages/PAGE_API';
export const PAGE_SETTINGS  = 'app/nav/pages/PAGE_SETTINGS';
export const PAGE_SHARING   = 'app/nav/pages/PAGE_SHARING';

export const MODAL_TYPE_FIELD = 'app/nav/modals/MODAL_TYPE_FIELD';



export function openPage(pageType) {
  return {
    type: OPEN_PAGE,
    pageType
  };
}

export function openModel() {
  return {
    type: OPEN_MODEL
  };
}
export function closeModel() {
  return {
    type: CLOSE_MODEL
  };
}

export function openContentItem() {
  return {
    type: OPEN_CONTENT_ITEM
  };
}
export function closeContentItem() {
  return {
    type: CLOSE_CONTENT_ITEM
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

  openedModel: false,
  
  openedContentItem: false,
  
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
        openedPage: action.pageType,
        openedContentItem: false,
        openedModel: false
      };
  
    case OPEN_MODEL:
      return {...state, openedModel: true};
      
    case CLOSE_MODEL:
      return {...state, openedModel: false};
    
    case SET_CURRENT_SITE:
      return {
        ...state,
        openedModel: false,
        openedContentItem: false
      };
  
    case OPEN_CONTENT_ITEM:
      return {...state, openedContentItem: true};
  
    case CLOSE_CONTENT_ITEM:
      return {...state, openedContentItem: false};
  
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
