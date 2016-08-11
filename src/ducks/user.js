import {Parse} from 'parse';


export const LOGIN_REQUEST              = 'app/users/LOGIN_REQUEST';
export const LOGIN_RESPONSE             = 'app/users/LOGIN_RESPONSE';
export const REGISTER_REQUEST           = 'app/users/REGISTER_REQUEST';
export const REGISTER_RESPONSE          = 'app/users/REGISTER_RESPONSE';
export const LOCAL_STORAGE_RESPONSE     = 'app/users/LOCAL_STORAGE_RESPONSE';
export const LOGOUT                     = 'app/users/LOGOUT';

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
        localStorage.setItem('authorization', JSON.stringify({email, password}));
        Parse.User.logIn(email, password)
          .then(() => {
            dispatch({
              type: LOGIN_RESPONSE,
              authorized: true
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
        dispatch({
          type: LOGIN_RESPONSE,
          authorized: true
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
        dispatch({
          type: LOGIN_RESPONSE,
          authorized: true
        });
      }, () => {
        let user = new Parse.User();
        user.set("username", email);
        user.set("email", email);
        user.set("password", password);
        user
          .signUp()
          .then(() => {
            localStorage.setItem('authorization', JSON.stringify({email, password}));
            Parse.User.logIn(email, password)
              .then(() => {
                dispatch({
                  type: LOGIN_RESPONSE,
                  authorized: true
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
        type: LOCAL_STORAGE_RESPONSE,
        email: auth.email,
        password: auth.password
      });

      Parse.User.logIn(auth.email, auth.password)
        .then(() => {
          dispatch({
            type: LOGIN_RESPONSE,
            authorized: true
          });
        }, () => {
          dispatch({
            type: LOGIN_RESPONSE,
            authError: ERROR_WRONG_PASS
          });
        });
    }

    return {
      type: LOCAL_STORAGE_RESPONSE
    };
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
  authorized: false,
  authError: null,

  email: '',
  password: '',

  id: ''
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {

    case LOGIN_REQUEST:
    case REGISTER_REQUEST:
      return {
        ...state,
        authorized: false,
        authError: null,
        email: action.email,
        password: action.password
      };

    case LOGIN_RESPONSE:
    case REGISTER_RESPONSE:
      return {
        ...state,
        authorized: action.authorized,
        authError:  action.authError
      };

    case LOCAL_STORAGE_RESPONSE:
      if (action.email)
        return {
          ...state,
          email:    action.email,
          password: action.password,
        };
      else
        return state;

    case LOGOUT:
      return {
        ...state,
        authorized: false
      };

    default:
      return state;
  }
}