import {combineReducers} from 'redux';

import models from './models';
import content from './content';
import nav from './nav';
import user from './user';
import media from './media';
import pay from './pay';


export default combineReducers({
  models,
  content,
  nav,
  user,
  media,
  pay
});