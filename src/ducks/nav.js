import {store} from '../index';


export const OPEN_PAGE  = 'app/nav/OPEN_PAGE';

export const PAGE_MODELS    = 'PAGE_MODELS';
export const PAGE_CONTENT   = 'PAGE_CONTENT';
export const PAGE_API       = 'PAGE_API';
export const PAGE_SETTINGS  = 'PAGE_SETTINGS';
export const PAGE_SHARING   = 'PAGE_SHARING';


export function openPage(pageType) {
  return {
    type: OPEN_PAGE,
    pageType
  };
}

const initialState = {
  openedPage: PAGE_MODELS
};

export default function navReducer(state = initialState, action) {
  switch (action.type) {
    case OPEN_PAGE:
      return { ...state, openedPage: action.pageType };

    default:
      return state;
  }
}
