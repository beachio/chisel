import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import {Helmet} from "react-helmet";

import Settings from 'components/mainArea/settings/Settings';
import {ROLE_OWNER, ROLE_ADMIN} from 'models/UserData';
import {updateSite, deleteSite} from 'ducks/models';
import {showAlert, USERSPACE_URL, SITE_URL} from 'ducks/nav';


export class SettingsContainer extends Component  {
  render() {
    const {models} = this.props;
    const {updateSite, deleteSite} = this.props.modelsActions;
    const {showAlert} = this.props.navActions;
    
    let curSite = models.currentSite;
    if (!curSite)
      return null;
    
    let title = `Settings - Site: ${curSite.name} - Chisel`;
    
    let onDeleteSite = site => {
      deleteSite(site);
      browserHistory.push(`/${USERSPACE_URL}`);
    };
    
    return (
      <div className="mainArea">
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <Settings site={curSite}
                  updateSite={updateSite}
                  deleteSite={onDeleteSite}
                  showAlert={showAlert}
                  isEditable={models.role == ROLE_OWNER || models.role == ROLE_ADMIN} />
      </div>
    );
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
