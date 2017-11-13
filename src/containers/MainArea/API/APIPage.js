import React, {Component} from 'react';
import InlineSVG from 'svg-inline-react';
import {connect} from 'react-redux';
import {Helmet} from "react-helmet";

import {ROLE_EDITOR} from 'models/UserData';
import {NoRights} from "components/mainArea/common/NoRights";


export class APIPage extends Component  {
  render() {
    return (
      <div className="start-working">
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
  
    let title = `Chisel`;
    let content = <NoRights />;

    const curSite = models.currentSite;
    if (curSite) {
      title = `API - Site: ${curSite.name} - Chisel`;

      const role = models.role;
      if (role != ROLE_EDITOR)
        content = <APIPage />;
    }
    
    return (
      <div className="mainArea">
        <Helmet>
          <title>{title}</title>
        </Helmet>
        {content}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {models: state.models};
}

export default connect(mapStateToProps)(APIPageContainer);