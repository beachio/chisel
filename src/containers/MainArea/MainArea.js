import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';
import {Routes, Route, Navigate} from "react-router-dom";

import {PAGE_PROFILE, PAGE_PAY_PLANS, PAGE_PAYMENT_METHODS, closeNotification} from 'ducks/nav';
import {setSiteFromNameId, setDefaultSite, withRouter} from "utils/routing";

import APIPage from 'containers/MainArea/API/APIPage';
import SettingsContainer from 'containers/MainArea/Settings/SettingsContainer';
import SharingContainer from 'containers/MainArea/Sharing/SharingContainer';
import ModelsListContainer from 'containers/MainArea/Models/ModelsListContainer';
import ModelContainer from 'containers/MainArea/Models/Model/ModelContainer';
import ContentListContainer from 'containers/MainArea/Content/ContentListContainer';
import ContentEditContainer from 'containers/MainArea/Content/ContentEdit/ContentEditContainer';
import UserProfile from 'containers/MainArea/UserProfile/UserProfile';
import PayPlans from 'containers/MainArea/PayPlans/PayPlans';
import Header from 'containers/Header/Header';
import Sidebar from 'containers/Sidebar/Sidebar';
import PaymentMethods from 'containers/MainArea/PaymentMethods/PaymentMethods';
import Notification from 'components/mainArea/common/Notification/Notification';

import styles from './MainArea.sss';

import ImageHammer from 'assets/images/hammer.svg';


@CSSModules(styles, {allowMultiple: true})
export class MainArea extends Component {
  cmpNoSites = (
    <div className="start-working">
      <InlineSVG className="hammer" src={ImageHammer}/>
      Add new site to start working
      <div className="hint">Find "Add new site" button in the sidebar</div>
    </div>
  );

  componentWillMount() {
    if (this.props.match.params.site)
      setSiteFromNameId(this.props.match.params.site);
    else
      setDefaultSite();
  }

  render() {
    const {models, nav} = this.props;
    const {closeNotification} = this.props.navActions;

    let content = null;

    if (nav.initEnded) {
      if (false || models.currentSite ||
          nav.openedPage == PAGE_PROFILE ||
          nav.openedPage == PAGE_PAY_PLANS ||
          nav.openedPage == PAGE_PAYMENT_METHODS) {
        content = (
          <Routes>
            <Route path="/userspace/site~:site/models/model~:model" element={<ModelContainer/> } />
            <Route path="/userspace/site~:site/models"              element={<ModelsListContainer/>} />
            <Route path="/userspace/site~:site/content/item~:item"  element={<ContentEditContainer/>} />
            <Route path="/userspace/site~:site/content"             element={<ContentListContainer/>} />
            <Route path="/userspace/site~:site/api"                 element={<APIPage/>} />
            <Route path="/userspace/site~:site/settings"            element={<SettingsContainer/>} />
            <Route path="/userspace/site~:site/sharing"             element={<SharingContainer/>} />

            <Route path="/userspace/profile"          element={<UserProfile/>} />
            <Route path="/userspace/pay-plans"        element={<PayPlans/>} />
            <Route path="/userspace/payment-methods"  element={<PaymentMethods/>} />

            <Route path="/userspace/site~:site" render={() => <Navigate to="/userspace/site~:site/models" replace />} />
          </Routes>
        );
      } else {
        content = this.cmpNoSites;
      }
    }

    return (
      <div styleName="wrapper">
        <Sidebar isSidebarVisible={nav.isSidebarVisible}/>

        <div styleName="inner">
          <Header />

          <div styleName="mainArea">
            {content}
          </div>

          {!!nav.notification &&
            <Notification notification={nav.notification}
                          closeNotification={closeNotification} />
          }
        </div>
      </div>
    );
  }
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MainArea));
