import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';
import {Navigate, Route, Routes} from "react-router-dom";

import {closeNotification, URL_CONTENT, URL_ITEM, URL_MODELS, URL_MODEL, URL_SHARING, URL_SITE, URL_SETTINGS, URL_API,
  URL_PROFILE, URL_PAYMENT_METHODS, URL_PAY_PLANS} from 'ducks/nav';
import Header from 'containers/Header/Header';
import Sidebar from 'containers/Sidebar/Sidebar';
import Notification from 'components/mainArea/common/Notification/Notification';
import APIPage from 'containers/MainArea/API/APIPage';
import SettingsContainer from 'containers/MainArea/Settings/SettingsContainer';
import SharingContainer from 'containers/MainArea/Sharing/SharingContainer';
import ModelsListContainer from 'containers/MainArea/Models/ModelsListContainer';
import ModelContainer from 'containers/MainArea/Models/Model/ModelContainer';
import ContentListContainer from 'containers/MainArea/Content/ContentListContainer';
import ContentEditContainer from 'containers/MainArea/Content/ContentEdit/ContentEditContainer';
import UserProfile from 'containers/MainArea/UserProfile/UserProfile';
import PayPlans from 'containers/MainArea/PayPlans/PayPlans';
import PaymentMethods from "containers/MainArea/PaymentMethods/PaymentMethods";

import styles from './MainArea.sss';

import ImageHammer from 'assets/images/hammer.svg';


function MainArea(props) {
  const {models, nav} = props;
  const {closeNotification} = props.navActions;

  const noSites = nav.initEnded && !models.sites.length;

  return (
    <div styleName="wrapper">
      <Sidebar isSidebarVisible={nav.isSidebarVisible}/>
      <div styleName="inner">
        <Header />
        <div styleName="mainArea">
          {noSites ?
            <>
              <Routes>
                <Route path={URL_PROFILE}                        element={<UserProfile />}           />
                <Route path={URL_PAY_PLANS}                      element={<PayPlans />}              />
                <Route path={URL_PAYMENT_METHODS}                element={<PaymentMethods />}        />
              </Routes>
              <div className="start-working">
                <InlineSVG className="hammer" src={ImageHammer}/>
                Add new site to start working
                <div className="hint">Find "Create new site" button in the sidebar</div>
              </div>
            </>
          :
            <Routes>
              <Route path={URL_PROFILE}                                         element={<UserProfile />}           />
              <Route path={URL_PAY_PLANS}                                       element={<PayPlans />}              />
              <Route path={URL_PAYMENT_METHODS}                                 element={<PaymentMethods />}        />
              <Route path={`${URL_SITE}:site/${URL_MODELS}/${URL_MODEL}:model`} element={<ModelContainer />}        />
              <Route path={`${URL_SITE}:site/${URL_MODELS}`}                    element={<ModelsListContainer />}   />
              <Route path={`${URL_SITE}:site/${URL_CONTENT}/${URL_ITEM}:item`}  element={<ContentEditContainer />}  />
              <Route path={`${URL_SITE}:site/${URL_CONTENT}`}                   element={<ContentListContainer />}  />
              <Route path={`${URL_SITE}:site/${URL_API}`}                       element={<APIPage />}               />
              <Route path={`${URL_SITE}:site/${URL_SETTINGS}`}                  element={<SettingsContainer />}     />
              <Route path={`${URL_SITE}:site/${URL_SHARING}`}                   element={<SharingContainer />}      />

              <Route path={`${URL_SITE}:site`}                                  element={<Navigate to={`${URL_MODELS}`} replace />} />
            </Routes>
          }
        </div>
        {!!nav.notification &&
          <Notification notification={nav.notification}
                        closeNotification={closeNotification} />
        }
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    models: state.models,
    nav:    state.nav
  };
}

function mapDispatchToProps(dispatch) {
  return {
    navActions: bindActionCreators({closeNotification}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CSSModules(MainArea, styles, {allowMultiple: true}));
