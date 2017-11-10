import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';
import {connect} from 'react-redux';
import {Helmet} from "react-helmet";

import styles from './APIPage.sss';


@CSSModules(styles, {allowMultiple: true})
export class APIPage extends Component  {
  render() {
    return (
      <div styleName="start-working" key="container">
        <InlineSVG styleName="hammer" src={require("assets/images/hammer.svg")}/>
        <div styleName="docs">
          Check <a styleName="docs-link" href="http://parseplatform.github.io/docs/" target="_blank">Parse</a> docs!
        </div>
      </div>
    );
  }
}

export class APIPageContainer extends Component  {
  render () {
    const {models} = this.props;
  
    let curSite = models.currentSite;
    if (!curSite)
      return null;
    
    let title = `API - Site: ${curSite.name} - Chisel`;
    
    return [
      <Helmet key="helmet">
        <title>{title}</title>
      </Helmet>,

      <APIPage key="container" />
    ];
  }
}

function mapStateToProps(state) {
  return {models: state.models};
}

export default connect(mapStateToProps)(APIPageContainer);