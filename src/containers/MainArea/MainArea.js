import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';
import {Helmet} from "react-helmet";

import SiteLoader from 'components/modals/SiteLoader/SiteLoader';
import Header from 'containers/Header/Header';
import Sidebar from 'containers/Sidebar/Sidebar';
import {ROLE_ADMIN, ROLE_DEVELOPER, ROLE_OWNER} from 'models/UserData';
import {PAGE_SHARING, PAGE_SETTINGS, PAGE_API, PAGE_MODELS, PAGE_CONTENT} from 'ducks/nav';

import styles from './MainArea.sss';


@CSSModules(styles, {allowMultiple: true})
export class MainArea extends Component {
  cmpNoSites = (
    <div className="mainArea">
      <div className="start-working">
        <InlineSVG className="hammer" src={require("assets/images/hammer.svg")}/>
        Add new site to start working
        <div className="hint">Find "Add new site" button at sidebar</div>
      </div>
    </div>
  );
  
  cmpNoRights = (
    <div className="mainArea">
      <div className="start-working">
        <InlineSVG className="hammer" src={require("assets/images/hammer.svg")}/>
        You don't have rights to access this section.
      </div>
    </div>
  );
  
  render() {
    const {models, nav} = this.props;
  
    let title = "Userspace - Chisel";
    
    let area = <SiteLoader/>;
    
    if (nav.initEnded) {
      let curSite = models.currentSite;
      let role = models.role;
      
      if (curSite) {
        title = `Site: ${curSite.name} - Chisel`;
        area = this.cmpNoRights;
        
        switch (nav.openedPage) {
          case PAGE_API:
            if (role == ROLE_OWNER || role == ROLE_ADMIN || role == ROLE_DEVELOPER)
              area = this.props.children;
            break;
            
          case PAGE_MODELS:
            if (role == ROLE_OWNER || role == ROLE_ADMIN)
              area = this.props.children;
            break;
  
          case PAGE_SHARING:
          case PAGE_SETTINGS:
          case PAGE_CONTENT:
            area = this.props.children;
        }
        
      } else {
        area = this.cmpNoSites;
      }
    }
    
    return (
      <div>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <Header />
        <div styleName="wrapper-inner">
          <Sidebar />
          {area}
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