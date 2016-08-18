import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import App from 'containers/app';
import configureStore from 'store/configureStore';
import {initApp} from 'ducks/initialize';

import './styles.global.sss';


export const store = configureStore();
store.dispatch(initApp());

ReactDOM.render(
  <Provider store={store}>
    <div className='app'>
      <App />
    </div>
  </Provider>,
  document.getElementById('app-root')
);