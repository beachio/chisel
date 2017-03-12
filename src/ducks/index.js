import {combineReducers} from 'redux';

import initialize from './initialize';
import models from './models';
import content from './content';
import nav from './nav';
import user from './user';
import media from './media';
import ACLset from './ACLset';


export default combineReducers({
  initialize,
  models,
  content,
  nav,
  user,
  media,
  ACLset
});