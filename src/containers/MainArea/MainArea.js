import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';

import SiteLoader from 'components/modals/SiteLoader/SiteLoader';
import Header from 'containers/Header/Header';
import Sidebar from 'containers/Sidebar/Sidebar';
import {ROLE_ADMIN, ROLE_DEVELOPER, ROLE_OWNER} from 'models/UserData';
import {PAGE_SHARING, PAGE_SETTINGS, PAGE_API, PAGE_MODELS, PAGE_CONTENT} from 'ducks/nav';

import styles from './MainArea.sss';


@CSSModules(styles, {allowMultiple: true})
export class MainArea extends Component  {
  render() {
    const {models, nav} = this.props;

    let cmpNoSites = (
      <div styleName="start-working">
        <InlineSVG styleName="hammer" src={require("./hammer.svg")}/>
        Add new site to start working
        <div styleName="hint">Find "Add new site" button at sidebar</div>
      </div>
    );
  
    let cmpNoRights = (
      <div styleName="start-working">
        <InlineSVG styleName="hammer" src={require("./hammer.svg")}/>
        You don't have rights to access this section.
      </div>
    );
    
    let area = <SiteLoader/>;
    if (nav.initEnded) {
      if (models.currentSite) {
        area = cmpNoRights;
        switch (nav.openedPage) {
          case PAGE_API:
            if (models.role == ROLE_OWNER || models.role == ROLE_ADMIN || models.role == ROLE_DEVELOPER)
              area = this.props.children;
            break;
            
          case PAGE_MODELS:
            if (models.role == ROLE_OWNER || models.role == ROLE_ADMIN)
              area = this.props.children;
            break;
  
          case PAGE_SHARING:
          case PAGE_SETTINGS:
          case PAGE_CONTENT:
            area = this.props.children;
        }
      } else {
        area = cmpNoSites;
      }
    }
    
    return (
      <div>
        <Header />
        <div styleName="wrapper-inner">
          <Sidebar />
          <div styleName="mainArea">
            {area}
          </div>
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

export default connect(mapStateToProps)(MainArea);