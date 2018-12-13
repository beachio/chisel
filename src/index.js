import 'whatwg-fetch';

import 'normalize.css';
import './fonts.css';
import './styles.global.sss';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {Router, Route, browserHistory, IndexRedirect, Redirect, applyRouterMiddleware} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import {useScroll} from 'react-router-scroll';
import {StripeProvider} from 'react-stripe-elements';

import App from 'containers/app';
import configureStore from 'store/configureStore';
import {initApp} from 'utils/initialize';
import {setCurrentPage, PAGE_MODELS, PAGE_MODELS_ITEM,  PAGE_PROFILE, PAGE_PAY_PLANS, PAGE_CONTENT,
  PAGE_CONTENT_ITEM, PAGE_API, PAGE_SETTINGS, PAGE_SHARING} from 'ducks/nav';

import APIPage from 'containers/MainArea/API/APIPage';
import Sign from 'containers/Sign/Sign';
import MainArea from 'containers/MainArea/MainArea';
import SettingsContainer from 'containers/MainArea/Settings/SettingsContainer';
import SharingContainer from 'containers/MainArea/Sharing/SharingContainer';
import ModelsListContainer from 'containers/MainArea/Models/ModelsListContainer';
import ModelContainer from 'containers/MainArea/Models/Model/ModelContainer';
import ContentListContainer from 'containers/MainArea/Content/ContentListContainer';
import ContentEditContainer from 'containers/MainArea/Content/ContentEdit/ContentEditContainer';
import UserProfile from 'containers/MainArea/UserProfile/UserProfile';
import PayPlans from 'containers/MainArea/PayPlans/PayPlans';
import EmailVerify from 'containers/LinksEmail/EmailVerify/EmailVerify';
import PasswordSet from 'containers/LinksEmail/PasswordSet/PasswordSet';
import InvalidLink from 'containers/LinksEmail/InvalidLink/InvalidLink';


export const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

initApp();

let SCP = page => store.dispatch(setCurrentPage(page));


class Root extends Component {
  state = {stripe: null};
  
  updateStripe(key) {
    this.setState({stripe: window.Stripe(key)})
  }
  
  render () {
    return <StripeProvider stripe={this.state.stripe}>
      <Provider store={store}>
        <Router history={history} render={applyRouterMiddleware(useScroll(() => [0,0]))}>
          <Route path='/' component={App}>
            <Route path="/email-verify" component={EmailVerify} />
            <Route path="/password-set-success" component={PasswordSet} />
            <Route path="/password-set" component={PasswordSet} />
            <Route path="/invalid-link" component={InvalidLink} />
            <Route path="/sign" component={Sign} />
            <Route path="/userspace" component={MainArea} >
              <Route path="/userspace/profile"              component={UserProfile}           onEnter={() => SCP(PAGE_PROFILE)} />
              <Route path="/userspace/pay-plans"            component={PayPlans}              onEnter={() => SCP(PAGE_PAY_PLANS)} />
              <Route path="/userspace/:site/models"         component={ModelsListContainer}   onEnter={() => SCP(PAGE_MODELS)} />
              <Route path="/userspace/:site/models/:model"  component={ModelContainer}        onEnter={() => SCP(PAGE_MODELS_ITEM)} />
              <Route path="/userspace/:site/content"        component={ContentListContainer}  onEnter={() => SCP(PAGE_CONTENT)} />
              <Route path="/userspace/:site/content/:item"  component={ContentEditContainer}  onEnter={() => SCP(PAGE_CONTENT_ITEM)} />
              <Route path="/userspace/:site/api"            component={APIPage}               onEnter={() => SCP(PAGE_API)} />
              <Route path="/userspace/:site/settings"       component={SettingsContainer}     onEnter={() => SCP(PAGE_SETTINGS)} />
              <Route path="/userspace/:site/sharing"        component={SharingContainer}      onEnter={() => SCP(PAGE_SHARING)} />
              <Redirect from='/userspace/:site' to='/userspace/:site/models' />
            </Route>
            <IndexRedirect to='/userspace' />
            <Redirect from='/*' to='/invalid-link' />
          </Route>
        </Router>
      </Provider>
    </StripeProvider>
  }
}

const root = ReactDOM.render(
  <Root/>,
  document.getElementById('app-root')
);

export const setStripeKey = key => root.updateStripe(key);
