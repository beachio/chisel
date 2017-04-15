import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Helmet} from "react-helmet";

import Sharing from 'components/mainArea/sharing/Sharing';
import {ROLE_OWNER, ROLE_ADMIN} from 'models/UserData';
import {addCollaboration, addInviteCollaboration, updateCollaboration, deleteCollaboration, deleteSelfCollaboration} from 'ducks/models';
import {showAlert} from 'ducks/nav';


export class SharingContainer extends Component  {
  render() {
    const {models, nav, user} = this.props;
    const {addCollaboration, addInviteCollaboration, updateCollaboration, deleteCollaboration, deleteSelfCollaboration} = this.props.modelsActions;
    const {showAlert} = this.props.navActions;
    
    let curSite = models.currentSite;
    if (!curSite)
      return null;
    
    let title = `Sharing - Site: ${curSite.name} - Chisel`;
    
    return (
      <div className="mainArea">
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <Sharing collaborations={curSite.collaborations}
                 owner={curSite.owner}
                 user={user.userData}
                 addCollaboration={addCollaboration}
                 addInviteCollaboration={addInviteCollaboration}
                 updateCollaboration={updateCollaboration}
                 deleteCollaboration={deleteCollaboration}
                 deleteSelfCollaboration={deleteSelfCollaboration}
                 showAlert={showAlert}
                 alertShowing={nav.alertShowing}
                 isEditable={models.role == ROLE_OWNER || models.role == ROLE_ADMIN} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    models:   state.models,
    nav:      state.nav,
    user:     state.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    modelsActions:  bindActionCreators({addCollaboration, addInviteCollaboration, updateCollaboration, deleteCollaboration, deleteSelfCollaboration}, dispatch),
    navActions:     bindActionCreators({showAlert}, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SharingContainer);
