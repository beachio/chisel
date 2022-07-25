import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';
import {Route, Switch, Redirect} from "react-router-dom";

import {closeNotification} from 'ducks/nav';
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


@CSSModules(styles, {allowMultiple: true})
export class MainArea extends Component {
  cmpNoSites = () =>
    <div className="start-working">
      <InlineSVG className="hammer" src={ImageHammer}/>
      Add new site to start working
      <div className="hint">Find "Create new site" button in the sidebar</div>
    </div>
  ;

  render() {
    const {models, nav} = this.props;
    const {closeNotification} = this.props.navActions;

    const noSites = !nav.initEnded || !models.currentSite;

    return (
      <div styleName="wrapper">
        <Sidebar isSidebarVisible={nav.isSidebarVisible}/>
        <div styleName="inner">
          <Header />
          <div styleName="mainArea">
            {noSites ?
              <Switch>
                <Route path="/userspace/profile"                          component={UserProfile}           />
                <Route path="/userspace/pay-plans"                        component={PayPlans}              />
                <Route path="/userspace/payment-methods"                  component={PaymentMethods}        />
                <Route render={this.cmpNoSites} />
              </Switch>
            :
              <Switch>
                <Route path="/userspace/profile"                          component={UserProfile}           />
                <Route path="/userspace/pay-plans"                        component={PayPlans}              />
                <Route path="/userspace/payment-methods"                  component={PaymentMethods}        />
                <Route path="/userspace/site~:site/models/model~:model"   component={ModelContainer}        />
                <Route path="/userspace/site~:site/models"                component={ModelsListContainer}   />
                <Route path="/userspace/site~:site/content/item~:item"    component={ContentEditContainer}  />
                <Route path="/userspace/site~:site/content"               component={ContentListContainer}  />
                <Route path="/userspace/site~:site/api"                   component={APIPage}               />
                <Route path="/userspace/site~:site/settings"              component={SettingsContainer}     />
                <Route path="/userspace/site~:site/sharing"               component={SharingContainer}      />

                <Redirect from='/userspace/site~:site' to='/userspace/site~:site/models' />
              </Switch>
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

export default connect(mapStateToProps, mapDispatchToProps)(MainArea);
