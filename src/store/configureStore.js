import {createStore, applyMiddleware} from 'redux';
import {createLogger} from 'redux-logger';
import thunk from 'redux-thunk';

import rootReducer from 'ducks';
import {initialization} from 'middleware/initialization';
import {routing} from 'middleware/routing';


export default function configureStore(initialState) {
  const logger = createLogger();

  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(initialization, routing, thunk, logger));

  if (module.hot) {
    module.hot.accept('../ducks', () => {
      const nextRootReducer = require('../ducks');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}