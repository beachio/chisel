import {store} from '../index';


export const OPEN_PAGE  = 'app/nav/OPEN_PAGE';

export const PAGE_MODELS    = 'app/nav/PAGE_MODELS';
export const PAGE_CONTENT   = 'app/nav/PAGE_CONTENT';
export const PAGE_API       = 'app/nav/PAGE_API';
export const PAGE_SETTINGS  = 'app/nav/PAGE_SETTINGS';
export const PAGE_SHARING   = 'app/nav/PAGE_SHARING';


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
