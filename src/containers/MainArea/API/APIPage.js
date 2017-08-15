import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';
import {connect} from 'react-redux';
import {Helmet} from "react-helmet";

import styles from './APIPage.sss';


@CSSModules(styles, {allowMultiple: true})
export class APIPage extends Component  {
  render() {
    const {models} = this.props;
  
    let curSite = models.currentSite;
    if (!curSite)
      return null;
    
    let title = `API - Site: ${curSite.name} - Chisel`;
    
    return (
      <div className="mainArea">
        <div className="start-working">
          <Helmet>
            <title>{title}</title>
          </Helmet>
          <InlineSVG className="hammer" src={require("assets/images/hammer.svg")}/>
          <div styleName="docs">
            Check <a styleName="docs-link" href="http://parseplatform.github.io/docs/" target="_blank">Parse</a> docs!
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {models: state.models};
}

export default connect(mapStateToProps)(APIPage);