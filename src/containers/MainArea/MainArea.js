import React, {Component} from 'react';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';
import {Helmet} from "react-helmet";

import Header from 'containers/Header/Header';
import Sidebar from 'containers/Sidebar/Sidebar';
import {ROLE_ADMIN, ROLE_DEVELOPER, ROLE_OWNER} from 'models/UserData';
import {PAGE_SHARING, PAGE_SETTINGS, PAGE_API, PAGE_MODELS, PAGE_CONTENT, PAGE_PROFILE,
  PAGE_CONTENT_ITEM, PAGE_MODELS_ITEM} from 'ducks/nav';

import styles from './MainArea.sss';


@CSSModules(styles, {allowMultiple: true})
export class MainArea extends Component {
  scrollArea;
  lastPage;

  cmpNoSites = (
    <div styleName="mainArea">
      <div className="start-working">
        <InlineSVG className="hammer" src={require("assets/images/hammer.svg")}/>
        Add new site to start working
        <div className="hint">Find "Add new site" button at sidebar</div>
      </div>
    </div>
  );
  
  cmpNoRights = (
    <div styleName="mainArea">
      <div className="start-working">
        <InlineSVG className="hammer" src={require("assets/images/hammer.svg")}/>
        You don't have rights to access this section.
      </div>
    </div>
  );

  //TODO: костыльно
  componentDidUpdate() {
    const {nav} = this.props;

    if (!this.scrollArea || !nav.initEnded || this.lastPage == nav.openedPage)
      return;

    if (this.lastPage)
      this.scrollArea.scrollTop = 0;
    else
      setTimeout(() => this.scrollArea.scrollTop = 0, 1);

    this.lastPage = nav.openedPage;
  }

  render() {
    const {models, nav} = this.props;
  
    let title = "Userspace - Chisel";
    
    let area = null;
    
    if (nav.initEnded) {
      let curSite = models.currentSite;
      let role = models.role;
      
      if (nav.openedPage == PAGE_PROFILE) {
        area = this.props.children;
        
      } else if (curSite) {
        title = `Site: ${curSite.name} - Chisel`;
        area = this.cmpNoRights;
        
        switch (nav.openedPage) {
          case PAGE_API:
            if (role == ROLE_OWNER || role == ROLE_ADMIN || role == ROLE_DEVELOPER)
              area = this.props.children;
            break;
            
          case PAGE_MODELS:
          case PAGE_MODELS_ITEM:
            if (role == ROLE_OWNER || role == ROLE_ADMIN)
              area = this.props.children;
            break;
  
          case PAGE_SHARING:
          case PAGE_SETTINGS:
          case PAGE_CONTENT:
          case PAGE_CONTENT_ITEM:
            area = this.props.children;
        }
        
      } else {
        area = this.cmpNoSites;
      }
    }
    
    return (
      <div styleName="wrapper">
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <div styleName="wrapper-inner">
          <Sidebar />
          <div styleName="mainArea" ref={c => this.scrollArea = c}>
            {area}
          </div>
        </div>
        <Header />
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