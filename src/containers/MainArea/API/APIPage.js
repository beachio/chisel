import React, {Component} from 'react';
import InlineSVG from 'svg-inline-react';
import {connect} from 'react-redux';
import {Helmet} from "react-helmet-async";

import {ROLE_EDITOR} from 'models/UserData';
import {NoRights} from "components/mainArea/common/NoRights";


export class APIPage extends Component  {
  render() {
    return (
      <div className="start-working">
        <InlineSVG className="hammer" src={require("assets/images/hammer.svg")}/>
        <div className="docs">
          Parse Server has extensive <a className="docs-link" href="http://parseplatform.github.io/docs/" target="_blank">Documentation</a>. Take a look!
          <div className="hint">Our Interactive API Docs will be coming soon...</div>
        </div>
      </div>
    );
  }
}

export class APIPageContainer extends Component  {
  render () {
    const {models} = this.props;

    let title = `Chisel`;
    let content = <NoRights key="content" />;

    const curSite = models.currentSite;
    if (curSite) {
      title = `API - Site: ${curSite.name} - Chisel`;

      const role = models.role;
      if (role != ROLE_EDITOR)
        content = <APIPage key="content" />;
    }

    return [
      <Helmet key="helmet">
        <title>{title}</title>
      </Helmet>,
      content
    ];
  }
}

function mapStateToProps(state) {
  return {models: state.models};
}

export default connect(mapStateToProps)(APIPageContainer);
