import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {Parse} from 'parse';

import App from './containers/app';
import configureStore from './store/configureStore';

import './styles.global.sss';


const ENDPOINT = "https://parse.nuwe.co:49178/parse";
const APP_ID = "d5701a37cf242d5ee398005d997e4229";
const CLIENT_KEY = "2b868e90b0af18609993e4575628784d";

function parseInit() {
  Parse.initialize(APP_ID, CLIENT_KEY);
  Parse.serverURL = ENDPOINT;
}


parseInit();
export const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <div className='app'>
      <App />
    </div>
  </Provider>,
  document.getElementById('app-root')
);