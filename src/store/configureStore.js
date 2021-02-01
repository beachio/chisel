import {createStore, applyMiddleware} from 'redux';
import {createLogger} from 'redux-logger';
import thunk from 'redux-thunk';

import rootReducer from 'ducks';
import {initialization, subscribeToNewModelContent} from 'middleware/initialization';
import {routing} from 'middleware/routing';


export default function configureStore(initialState) {
  const logger = createLogger();
  
  const middleware = [initialization, routing, subscribeToNewModelContent, thunk];
  if (process.env.NODE_ENV == 'development')
    middleware.push(logger);

  const store = createStore(rootReducer, initialState, applyMiddleware(...middleware));

  if (module.hot)
    module.hot.accept('../ducks', () => {
      const nextRootReducer = require('../ducks');
      store.replaceReducer(nextRootReducer);
    });

  return store;
}