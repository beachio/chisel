import React, {Component} from 'react';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';
import {Helmet} from "react-helmet";
import {ScrollContainer} from 'react-router-scroll';

import Header from 'containers/Header/Header';
import Sidebar from 'containers/Sidebar/Sidebar';
import {PAGE_PROFILE} from 'ducks/nav';

import styles from './MainArea.sss';


@CSSModules(styles, {allowMultiple: true})
export class MainArea extends Component {
  cmpNoSites = (
    <div className="start-working">
      <InlineSVG className="hammer" src={require("assets/images/hammer.svg")}/>
      Add new site to start working
      <div className="hint">Find "Add new site" button in the sidebar</div>
    </div>
  );

  render() {
    const {models, nav} = this.props;

    let title = "Userspace - Chisel";
    let content = null;

    if (nav.initEnded) {
      let curSite = models.currentSite;

      if (curSite)
        title = `Site: ${curSite.name} - Chisel`;

      if (curSite || nav.openedPage == PAGE_PROFILE)
        content = this.props.children;
      else
        content = this.cmpNoSites;
    }

    return (
      <div styleName="wrapper">
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <div styleName="wrapper-inner">
          <Sidebar />
          <ScrollContainer scrollKey="mainArea" shouldUpdateScroll={() => [0,0]}>
            <div styleName="mainArea">
              {content}
            </div>
          </ScrollContainer>
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
