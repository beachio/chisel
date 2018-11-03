import {store} from 'index';
import {Parse} from 'parse';

import {UserData} from 'models/UserData';
import {config} from 'utils/initialize';
import {send} from 'utils/server';


export const LOGIN_REQUEST      = 'app/user/LOGIN_REQUEST';
export const LOGIN_RESPONSE     = 'app/user/LOGIN_RESPONSE';
export const REGISTER_REQUEST   = 'app/user/REGISTER_REQUEST';
export const REGISTER_RESPONSE  = 'app/user/REGISTER_RESPONSE';
export const LOGOUT             = 'app/user/LOGOUT';
export const UPDATE             = 'app/user/UPDATE';
export const UPDATE_EMAIL       = 'app/user/UPDATE_EMAIL';
export const UPDATE_PASSWORD    = 'app/user/UPDATE_PASSWORD';
export const RESTORE_PASSWORD   = 'app/user/RESTORE_PASSWORD';
export const RESEND_VERIF       = 'app/user/RESEND_VERIF';
export const RESET_STATUS       = 'app/user/RESET_STATUS';

export const ERROR_USER_EXISTS  = 'app/user/ERROR_USER_EXISTS';
export const ERROR_WRONG_PASS   = 'app/user/ERROR_WRONG_PASS';
export const ERROR_UNVERIF      = 'app/user/ERROR_UNVERIF';
export const ERROR_OTHER        = 'app/user/ERROR_OTHER';
export const OK                 = 'app/user/OK';


export function register(email, password) {
  return dispatch => {
    dispatch({
      type: REGISTER_REQUEST,
      email,
      password
    });

    const user = new Parse.User();
    user.set("username", email);
    user.set("email", email);
    user.set("password", password);

    send(user.signUp())

      .then(() => {
        dispatch({
          type: REGISTER_RESPONSE,
          status: OK
        });
      })
      
      .catch(error => {
        let status = ERROR_OTHER;
        switch (error.code) {
          case 202:
          case 203:
            status = ERROR_USER_EXISTS; break;
        }

        dispatch({
          type: REGISTER_RESPONSE,
          status
        });
      });
  };
}

export function login(email, password) {
  return dispatch => {
    dispatch({
      type: LOGIN_REQUEST,
      email,
      password
    });

    send(Parse.User.logIn(email, password))

      .then(() => {
        const userData = new UserData().setOrigin();
        dispatch({
          type: LOGIN_RESPONSE,
          status: OK,
          authorized: true,
          userData
        });
      })
      
      .catch(error => {
        let status = ERROR_OTHER;
        switch (error.code) {
          case 101: status = ERROR_WRONG_PASS; break;
          case 205: status = ERROR_UNVERIF;    break;
        }
  
        dispatch({
          type: LOGIN_RESPONSE,
          status
        });
      });
  };
}

export function getLocalStorage() {
  return dispatch => {
    const currentUser = Parse.User.current();
    if (!currentUser || !currentUser.get('sessionToken')) {
      dispatch({type: LOGIN_RESPONSE});
      return;
    }
  
    send(currentUser.fetch())
      .then(() => {
        const userData = new UserData().setOrigin();
        dispatch({
          type: LOGIN_RESPONSE,
          status: OK,
          authorized: true,
          userData
        });
      })
      .catch(() => dispatch ({type: LOGIN_RESPONSE}));
  }
}

export function logout() {
  send(Parse.User.logOut());
  
  return {type: LOGOUT};
}

export function update(data) {
  data.updateOrigin();
  send(data.origin.save());

  return {
    type: UPDATE,
    data
  };
}

export function updateEmail(email) {
  if (!email)
    return null;
  
  return dispatch => {
    const userData = Parse.User.current();
    send(userData.requestEmailChange(email))
      .then(() => {
        dispatch({
          type: UPDATE_EMAIL,
          status: OK,
          email
        });
      })
      .catch(error => {
        let status = ERROR_OTHER;
        switch (error.code) {
          case 202: status = ERROR_USER_EXISTS; break;
        }
        dispatch({
          type: UPDATE_EMAIL,
          status
        });
      });
  };
}

export function updatePassword(password) {
  if (!password)
    return null;
  
  const userData = Parse.User.current();
  userData.set(`password`, password);
  send(userData.save());
  
  return {type: UPDATE_PASSWORD};
}

export function restorePassword(email) {
  if (!email)
    return null;
  
  return dispatch => {
    send(Parse.User.requestPasswordReset(email))
      .then(result =>
        dispatch({
          type: RESTORE_PASSWORD,
          status: OK,
          result
        })
      )
      .catch(error =>
        dispatch({
          type: RESTORE_PASSWORD,
          status: ERROR_OTHER
        })
      );
  };
}

export function resendVerEmail(email) {
  if (!email) {
    let userData = store.getState().user.userData;
    if (userData && userData.emailNew)
      email = userData.emailNew;
    else
      return null;
  }
  
  return dispatch => {
    send(fetch(config.serverURL + '/verificationEmailRequest', {
      method: 'POST',
      headers: {
        'X-Parse-Application-Id': config.appId,
        'X-Parse-REST-API-Key': config.RESTkey
      },
      body: JSON.stringify({email})
    }))
      .then(result =>
        dispatch({
          type: RESEND_VERIF,
          status: OK
        })
      )
      .catch(error =>
        dispatch({
          type: RESEND_VERIF,
          status: ERROR_OTHER
        })
      );
  };
}

export function resetStatus() {
  return {
    type: RESET_STATUS
  };
}

const initialState = {
  localStorageReady: false,

  authorized: false,
  status: null,

  email: '',
  password: '',

  userData: null,
  
  pending: false
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {

    case LOGIN_REQUEST:
      return {
        ...state,
        authorized: false,
        status: null,
        email: action.email,
        password: action.password,
        pending: true
      };

    case REGISTER_REQUEST:
      return {
        ...state,
        authorized: false,
        status: null,
        email: action.email,
        password: action.password,
        pending: true
      };

    case LOGIN_RESPONSE:
      return {
        ...state,
        authorized: action.authorized,
        status: action.status,
        userData: action.userData,
        localStorageReady: true,
        password: ``,
        pending: false
      };

    case REGISTER_RESPONSE:
      return {
        ...state,
        status: action.status,
        localStorageReady: true,
        password: ``,
        pending: false
      };

    case LOGOUT:
      return {
        ...state,
        authorized: false,
        email: ``
      };
      
    case UPDATE:
      return {
        ...state,
        userData: action.data
      };
  
    case UPDATE_EMAIL:
      let userData = state.userData;
      if (action.email)
        userData.emailNew = action.email;
      return {
        ...state,
        userData,
        status: action.status
      };
      
    case RESTORE_PASSWORD:
      return {
        ...state,
        status: action.status
      };
      
    case UPDATE_PASSWORD:
    case RESEND_VERIF:
      return {...state};

    case RESET_STATUS:
      return {
        ...state,
        status: null
      };
      
    default:
      return state;
  }
}