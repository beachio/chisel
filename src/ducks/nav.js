import {store} from '../index';


export const OPEN_PAGE  = 'app/nav/OPEN_PAGE';
export const OPEN_MODEL  = 'app/nav/OPEN_MODEL';
export const CLOSE_MODEL  = 'app/nav/CLOSE_MODEL';

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

const initialState = {
  openedPage: PAGE_MODELS,
  
  openedModel: false
};

export default function navReducer(state = initialState, action) {
  switch (action.type) {
    case OPEN_PAGE:
      return {...state, openedPage: action.pageType};
  
    case OPEN_MODEL:
      return {...state, openedModel: true};
      
    case CLOSE_MODEL:
      return {...state, openedModel: false};
      
    default:
      return state;
  }
}
