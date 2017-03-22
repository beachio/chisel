import {createStore, applyMiddleware, compose} from 'redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import {browserHistory} from 'react-router';
import {routerMiddleware, push} from 'react-router-redux';

import rootReducer from 'ducks';
import {initialization} from 'middleware/initialization';
import {structure} from 'middleware/structure';
import {routing} from 'middleware/routing';


export default function configureStore(initialState) {
  const logger = createLogger();

  const router = routerMiddleware(browserHistory);
  
  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(initialization, structure, routing, router, thunk, logger));

  if (module.hot) {
    module.hot.accept('../ducks', () => {
      const nextRootReducer = require('../ducks');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}