import {store} from '../index';


export const OPEN_MODAL     = 'app/windows/OPEN_MODAL';
export const CLOSE_MODAL    = 'app/windows/CLOSE_MODAL';

export const MODAL_SATOSHI  = 'MODAL_SATOSHI';


export function openModal(modalType) {
  return {
    type: OPEN_MODAL,
    modalType
  };
}

export function closeModal() {
  return {
    type: CLOSE_MODAL
  };
}

const initialState = {
  openedModal: null
};

export default function windowsReducer(state = initialState, action) {
  switch (action.type) {
    case OPEN_MODAL:
      return { ...state, openedModal: action.modalType };

    case CLOSE_MODAL:
      return { ...state, openedModal: null };

    default:
      return state;
  }
}
