import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Helmet} from "react-helmet-async";

import Settings from 'components/mainArea/settings/Settings';
import {ROLE_OWNER, ROLE_ADMIN} from 'models/UserData';
import {updateSite, deleteSite} from 'ducks/models';
import {showAlert} from 'ducks/nav';


function SettingsContainer(props)  {
  const {models} = props;
  const {updateSite, deleteSite} = props.modelsActions;
  const {showAlert} = props.navActions;

  const site = models.currentSite;
  if (!site)
    return null;

  const title = `Settings - Site: ${site.name} - Chisel`;

  return <>
    <Helmet>
      <title>{title}</title>
    </Helmet>
    <Settings site={site}
              updateSite={updateSite}
              deleteSite={deleteSite}
              showAlert={showAlert}
              isEditable={models.role == ROLE_OWNER || models.role == ROLE_ADMIN} />
  </>;
}

function mapStateToProps(state) {
  return {
    models:   state.models
  };
}

function mapDispatchToProps(dispatch) {
  return {
    modelsActions:  bindActionCreators({updateSite, deleteSite}, dispatch),
    navActions:     bindActionCreators({showAlert}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsContainer);
