import {Parse} from 'parse';

import {UserData} from '../models/UserData';


export const LOGIN_REQUEST          = 'app/users/LOGIN_REQUEST';
export const LOGIN_RESPONSE         = 'app/users/LOGIN_RESPONSE';
export const REGISTER_REQUEST       = 'app/users/REGISTER_REQUEST';
export const REGISTER_RESPONSE      = 'app/users/REGISTER_RESPONSE';
export const LOGOUT                 = 'app/users/LOGOUT';

export const ERROR_USER_EXISTS  = 'app/users/ERROR_USER_EXISTS';
export const ERROR_WRONG_PASS   = 'app/users/ERROR_WRONG_PASS';


export function register(email, password) {
  return dispatch => {
    dispatch({
      type: REGISTER_REQUEST,
      email,
      password
    });

    let user = new Parse.User();
    user.set("username", email);
    user.set("email", email);
    user.set("password", password);
    user
      .signUp()
      .then(() => {
        Parse.User.logIn(email, password)
          .then(() => {
            localStorage.setItem('authorization', JSON.stringify({email, password}));
            let userData = new UserData().setFromServer(Parse.User.current());
            dispatch({
              type: LOGIN_RESPONSE,
              authorized: true,
              userData
            });
          }, () => {
            console.log('FATAL ERROR!!! AAAAAA!!!');
          });
      }, () => {
        dispatch({
          type: REGISTER_RESPONSE,
          authError: ERROR_USER_EXISTS
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

    Parse.User.logIn(email, password)
      .then(() => {
        localStorage.setItem('authorization', JSON.stringify({email, password}));
        let userData = new UserData().setFromServer(Parse.User.current());
        dispatch({
          type: LOGIN_RESPONSE,
          authorized: true,
          userData
        });
      }, () => {
        dispatch({
          type: LOGIN_RESPONSE,
          authError: ERROR_WRONG_PASS
        });
      });
  };
}

export function loginOrRegister(email, password) {
  return dispatch => {
    dispatch({
      type: LOGIN_REQUEST,
      email,
      password
    });

    Parse.User.logIn(email, password)
      .then(() => {
        localStorage.setItem('authorization', JSON.stringify({email, password}));
        let userData = new UserData().setFromServer(Parse.User.current());
        dispatch({
          type: LOGIN_RESPONSE,
          authorized: true,
          userData
        });
      }, () => {
        let user = new Parse.User();
        user.set("username", email);
        user.set("email", email);
        user.set("password", password);
        user
          .signUp()
          .then(() => {
            Parse.User.logIn(email, password)
              .then(() => {
                localStorage.setItem('authorization', JSON.stringify({email, password}));
                let userData = new UserData().setFromServer(Parse.User.current());
                dispatch({
                  type: LOGIN_RESPONSE,
                  authorized: true,
                  userData
                });
              }, () => {
                console.log('FATAL ERROR!!! AAAAAA!!!');
              });
          }, () => {
            dispatch({
              type: LOGIN_RESPONSE,
              authError: ERROR_WRONG_PASS
            });
          });
      });
  };
}

export function getLocalStorage() {
  return dispatch => {
    let authStr = localStorage.getItem('authorization');
    if (authStr) {
      let auth = JSON.parse(authStr);
      dispatch({
        type: LOGIN_REQUEST,
        email: auth.email,
        password: auth.password
      });

      Parse.User.logIn(auth.email, auth.password)
        .then(() => {
          let userData = new UserData().setFromServer(Parse.User.current());
          dispatch({
            type: LOGIN_RESPONSE,
            authorized: true,
            userData
          });
        }, () => {
          dispatch({
            type: LOGIN_RESPONSE
          });
        });
    } else {
      dispatch({
        type: LOGIN_RESPONSE
      });
    }
  };
}

export function logout() {
  localStorage.clear();
  Parse.User.logOut();
  return {
    type: LOGOUT
  };
}


const initialState = {
  fetchingRequest: true,

  authorized: false,
  authError: null,

  email: '',
  password: '',

  userData: null
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {

    case LOGIN_REQUEST:
    case REGISTER_REQUEST:
      return {
        ...state,
        fetchingRequest: true,
        authorized: false,
        authError: null,
        email: action.email,
        password: action.password
      };

    case LOGIN_RESPONSE:
    case REGISTER_RESPONSE:
      return {
        ...state,
        fetchingRequest: false,
        authorized: action.authorized,
        authError:  action.authError,
        userData:   action.userData
      };

    case LOGOUT:
      return {
        ...state,
        authorized: false
      };

    default:
      return state;
  }
}