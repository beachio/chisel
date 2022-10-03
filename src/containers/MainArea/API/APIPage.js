import React from 'react';
import InlineSVG from 'svg-inline-react';
import {connect} from 'react-redux';
import {Helmet} from "react-helmet-async";

import {ROLE_EDITOR} from 'models/UserData';
import NoRights from "components/mainArea/common/NoRights";

import ImageHammer from 'assets/images/hammer.svg';


function APIPage() {
  return (
    <div className="start-working">
      <InlineSVG className="hammer" src={ImageHammer}/>
      <div className="docs">
        Parse Server has extensive <a className="docs-link" href="http://parseplatform.github.io/docs/" target="_blank">Documentation</a>. Take a look!
        <div className="hint">Our Interactive API Docs will be coming soon...</div>
      </div>
    </div>
  );
}

function APIPageContainer({models, nav}) {
  let title = `Chisel`;
  let content = nav.initEnded ? <NoRights /> : null;

  const curSite = models.currentSite;
  if (curSite) {
    title = `API - Site: ${curSite.name} - Chisel`;

    const role = models.role;
    if (role != ROLE_EDITOR)
      content = <APIPage />;
  }

  return <>
    <Helmet>
      <title>{title}</title>
    </Helmet>
    {content}
  </>;
}

function mapStateToProps(state) {
  return {
    models: state.models,
    nav:    state.nav
  };
}

export default connect(mapStateToProps)(APIPageContainer);
