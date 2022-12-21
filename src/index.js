import 'whatwg-fetch';
import 'normalize.css';

import './fonts.css';
import './styles.global.sss';

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {HashRouter, BrowserRouter, Route, Routes} from "react-router-dom";
import {HelmetProvider} from 'react-helmet-async';

import App from 'containers/app';
import configureStore from 'store/configureStore';
import {isElectron} from 'utils/common';
import {initApp} from 'utils/initialize';


const Router = isElectron() ? HashRouter : BrowserRouter;

export const store = configureStore();

initApp();

function Root() {
  return (
//  <React.StrictMode>
      <Provider store={store}>
        <HelmetProvider>
          <Router>
            <Routes>
              <Route path="*" element={<App />} />
            </Routes>
          </Router>
        </HelmetProvider>
      </Provider>
//  </React.StrictMode>
  );
}

const root = ReactDOM.render(
  <Root/>,
  document.getElementById('app-root')
);
