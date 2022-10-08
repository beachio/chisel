import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Helmet} from "react-helmet-async";

import Media from 'components/mainArea/media/Media';


function MediaContainer(props)  {
  const {media, models, nav} = props;

  const site = models.currentSite;
  if (!site)
    return null;

  const title = `Media - Site: ${site.name} - Chisel`;

  return <>
    <Helmet>
      <title>{title}</title>
    </Helmet>
    <Media mediaItems={media.items}
           currentSite={models.currentSite}
           alertShowing={nav.alertShowing} />
  </>;
}

function mapStateToProps(state) {
  return {
    media:  state.media,
    models: state.models,
    nav:    state.nav
  };
}

function mapDispatchToProps(dispatch) {
  return {
    modelsActions:  bindActionCreators({}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MediaContainer);
