import React, {Component} from 'react';
import InlineSVG from 'svg-inline-react';
import {connect} from 'react-redux';
import {Helmet} from "react-helmet";


export class APIPage extends Component  {
  render() {
    return (
      <div className="start-working" key="container">
        <InlineSVG className="hammer" src={require("assets/images/hammer.svg")}/>
        <div className="docs">
          Check <a className="docs-link" href="http://parseplatform.github.io/docs/" target="_blank">Parse</a> docs!
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