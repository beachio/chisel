import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import {Helmet} from "react-helmet-async";

import Settings from 'components/mainArea/settings/Settings';
import {ROLE_OWNER, ROLE_ADMIN} from 'models/UserData';
import {updateSite, deleteSite} from 'ducks/models';
import {showAlert, URL_USERSPACE} from 'ducks/nav';


export class SettingsContainer extends Component  {
  render() {
    const {models} = this.props;
    const {updateSite, deleteSite} = this.props.modelsActions;
    const {showAlert} = this.props.navActions;
    
    const site = models.currentSite;
    if (!site)
      return null;
    
    const title = `Settings - Site: ${site.name} - Chisel`;
    
    const onDeleteSite = site => {
      deleteSite(site);
      browserHistory.push(`/${URL_USERSPACE}`);
    };
    
    return <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Settings site={site}
                updateSite={updateSite}
                deleteSite={onDeleteSite}
                showAlert={showAlert}
                isEditable={models.role == ROLE_OWNER || models.role == ROLE_ADMIN} />
    </>;
  }
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
