import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Helmet} from "react-helmet-async";

import Media from 'components/mainArea/media/Media';
import {addMediaItem} from 'ducks/media';


function MediaContainer(props)  {
  const {media, models, nav} = props;
  const {addMediaItem} = props.mediaActions;

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
           alertShowing={nav.alertShowing}
           addMediaItem={addMediaItem} />
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
    mediaActions:  bindActionCreators({addMediaItem}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MediaContainer);
