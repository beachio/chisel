import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';

import models from './models';
import content from './content';
import nav from './nav';
import user from './user';
import media from './media';
import serverStatus from './serverStatus';
import templates from './templates';


export default combineReducers({
  models,
  content,
  nav,
  user,
  media,
  serverStatus,
  templates,
  routing: routerReducer
});