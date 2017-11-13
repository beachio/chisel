import React, {Component} from 'react';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';
import {Helmet} from "react-helmet";

import Header from 'containers/Header/Header';
import Sidebar from 'containers/Sidebar/Sidebar';
import {PAGE_PROFILE} from 'ducks/nav';

import styles from './MainArea.sss';


@CSSModules(styles, {allowMultiple: true})
export class MainArea extends Component {
  scrollArea;
  lastPage;

  cmpNoSites = (
    <div className="mainArea">
      <div className="start-working">
        <InlineSVG className="hammer" src={require("assets/images/hammer.svg")}/>
        Add new site to start working
        <div className="hint">Find "Add new site" button at sidebar</div>
      </div>
    </div>
  );

  render() {
    const {models, nav} = this.props;
  
    let title = "Userspace - Chisel";
    let content = null;
    
    if (nav.initEnded) {
      let curSite = models.currentSite;

      if (curSite || nav.openedPage == PAGE_PROFILE) {
        title = `Site: ${curSite.name} - Chisel`;
        content = this.props.children;
        
      } else {
        content = this.cmpNoSites;
      }
    }
    
    return (
      <div styleName="wrapper">
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <div styleName="wrapper-inner">
          <Sidebar />
          {content}
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