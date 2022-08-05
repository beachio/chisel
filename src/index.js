import 'whatwg-fetch';
import 'normalize.css';

import './fonts.css';
import './styles.global.sss';

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {HelmetProvider} from 'react-helmet-async';

import App from 'containers/app';
import configureStore from 'store/configureStore';
import {initApp} from 'utils/initialize';


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
