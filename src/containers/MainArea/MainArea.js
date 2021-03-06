import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';
import {ScrollContainer} from 'react-router-scroll';

import Header from 'containers/Header/Header';
import Sidebar from 'containers/Sidebar/Sidebar';
import Notification from 'components/mainArea/common/Notification/Notification';
import {PAGE_PROFILE, PAGE_PAY_PLANS, PAGE_PAYMENT_METHODS, closeNotification} from 'ducks/nav';

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

  render() {
    const {models, nav} = this.props;
    const {closeNotification} = this.props.navActions;

    let content = null;

    if (nav.initEnded) {
      const curSite = models.currentSite;
      if (curSite ||
          nav.openedPage == PAGE_PROFILE ||
          nav.openedPage == PAGE_PAY_PLANS ||
          nav.openedPage == PAGE_PAYMENT_METHODS)
        content = this.props.children;
      else
        content = this.cmpNoSites;
    }

    return (
      <div styleName="wrapper">
        <Sidebar isSidebarVisible={nav.isSidebarVisible}/>
        <div styleName="inner">
          <Header />
          <ScrollContainer scrollKey="mainArea" shouldUpdateScroll={() => [0,0]}>
            <div styleName="mainArea">
              {content}
            </div>
          </ScrollContainer>
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
