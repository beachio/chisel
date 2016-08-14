import {combineReducers} from 'redux';

import initialize from './initialize';
import models from './models';
import nav from './nav';
import sites from './sites';
import user from './user';


export default combineReducers({
  initialize,
  models,
  nav,
  sites,
  user
});