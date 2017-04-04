import 'babel-polyfill';

import 'normalize.css';
import './styles.global.sss';

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {Router, Route, browserHistory, IndexRedirect, Redirect} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';

import App from 'containers/app';
import configureStore from 'store/configureStore';
import {initApp} from 'utils/initialize';
import {scrollUp} from 'utils/common';

import APIPage from 'containers/MainArea/API/APIPage';
import Sign from 'containers/Sign/Sign';
import MainArea from 'containers/MainArea/MainArea';
import SettingsContainer from 'containers/MainArea/Settings/SettingsContainer';
import SharingContainer from 'containers/MainArea/Sharing/SharingContainer';
import ModelsListContainer from 'containers/MainArea/Models/ModelsListContainer';
import ModelContainer from 'containers/MainArea/Models/Model/ModelContainer';
import ContentListContainer from 'containers/MainArea/Content/ContentListContainer';
import ContentEditContainer from 'containers/MainArea/Content/ContentEdit/ContentEditContainer';


export const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

initApp();

ReactDOM.render(
  <Provider store={store}>
    <Router onUpdate={scrollUp} history={history}>
      <Route path='/' component={App}>
        <Route path="/sign" component={Sign} />
        <Route path="/userspace" component={MainArea} >
          <Route path="/userspace/:site/models" component={ModelsListContainer}/>
          <Route path="/userspace/:site/models/:model" component={ModelContainer}/>
          <Route path="/userspace/:site/content" component={ContentListContainer}/>
          <Route path="/userspace/:site/content/:item" component={ContentEditContainer}/>
          <Route path="/userspace/:site/api" component={APIPage}/>
          <Route path="/userspace/:site/settings" component={SettingsContainer}/>
          <Route path="/userspace/:site/sharing" component={SharingContainer}/>
          <Redirect from='/userspace/:site' to='/userspace/:site/models' />
        </Route>
        <IndexRedirect to='/userspace' />
        <Redirect from='/*' to='/userspace' />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app-root')
);
