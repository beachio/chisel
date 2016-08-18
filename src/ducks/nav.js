import {store} from '../index';


export const OPEN_PAGE    = 'app/nav/OPEN_PAGE';
export const OPEN_MODEL   = 'app/nav/OPEN_MODEL';
export const CLOSE_MODEL  = 'app/nav/CLOSE_MODEL';
export const SHOW_ALERT   = 'app/nav/SHOW_ALERT';
export const CLOSE_ALERT  = 'app/nav/CLOSE_ALERT';

export const PAGE_MODELS    = 'app/nav/pages/PAGE_MODELS';
export const PAGE_CONTENT   = 'app/nav/pages/PAGE_CONTENT';
export const PAGE_API       = 'app/nav/pages/PAGE_API';
export const PAGE_SETTINGS  = 'app/nav/pages/PAGE_SETTINGS';
export const PAGE_SHARING   = 'app/nav/pages/PAGE_SHARING';



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

export function showAlert(alertParams) {
  return {
    type: SHOW_ALERT,
    alertParams
  };
}
export function closeAlert() {
  return {
    type: CLOSE_ALERT
  };
}

const initialState = {
  openedPage: PAGE_MODELS,
  
  openedModel: false,

  alertShowing: false,
  alertParams: null
};

export default function navReducer(state = initialState, action) {
  switch (action.type) {
    case OPEN_PAGE:
      return {...state, openedPage: action.pageType};
  
    case OPEN_MODEL:
      return {...state, openedModel: true};
      
    case CLOSE_MODEL:
      return {...state, openedModel: false};

    case SHOW_ALERT:
      return {...state, alertShowing: true, alertParams: action.alertParams};

    case CLOSE_ALERT:
      return {...state, alertShowing: false};
      
    default:
      return state;
  }
}
