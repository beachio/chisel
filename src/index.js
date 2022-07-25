import 'whatwg-fetch';
import 'normalize.css';

import './fonts.css';
import './styles.global.sss';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter as Router} from "react-router-dom";
import {StripeProvider} from 'react-stripe-elements';
import {HelmetProvider} from 'react-helmet-async';

import App from 'containers/app';
import configureStore from 'store/configureStore';
import {initApp} from 'utils/initialize';


export const store = configureStore();

initApp();

class Root extends Component {
  state = {stripe: null};
  
  updateStripe(key) {
    this.setState({stripe: window.Stripe(key)})
  }
  
  render () {
    return (
    //  <React.StrictMode>
        <StripeProvider stripe={this.state.stripe}>
          <Provider store={store}>
            <HelmetProvider>
              <Router>
                <App />
              </Router>
            </HelmetProvider>
          </Provider>
        </StripeProvider>
    //  </React.StrictMode>
    );
  }
}

const root = ReactDOM.render(
  <Root/>,
  document.getElementById('app-root')
);

export const setStripeKey = key => root.updateStripe(key);
