import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';

import Header from 'containers/Header/Header';
import Sidebar from 'containers/Sidebar/Sidebar';
import InlineSVG from 'svg-inline-react';

import styles from './MainArea.sss';


@CSSModules(styles, {allowMultiple: true})
export class MainArea extends Component  {
  render() {
    const {models} = this.props;

    let curSite = models.currentSite;

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
    
    return (
      <div>
        <Header />
        <div styleName="wrapper-inner">
          <Sidebar />
          <div styleName="mainArea">
            {!!curSite ?
              this.props.children : cmpNoSites}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    models:   state.models,
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MainArea);
