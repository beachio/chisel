import {combineReducers} from 'redux';

import initialize from './initialize';
import nav from './nav';
import user from './user';


export default combineReducers({
  initialize,
  nav,
  user
});