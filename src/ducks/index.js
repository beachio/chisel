import {combineReducers} from 'redux';

import initialize from './initialize';
import models from './models';
import nav from './nav';
import user from './user';


export default combineReducers({
  initialize,
  models,
  nav,
  user
});