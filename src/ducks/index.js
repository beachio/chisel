import {combineReducers} from 'redux';
import nav from './nav';
import user from './user';


export default combineReducers({
  nav,
  user
});