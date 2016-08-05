import {createStore, applyMiddleware, compose} from 'redux';
import rootReducer from '../ducks';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';


export default function configureStore(initialState) {
  const logger = createLogger();

  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(logger, thunk));

  if (module.hot) {
    module.hot.accept('../ducks', () => {
      const nextRootReducer = require('../ducks');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}