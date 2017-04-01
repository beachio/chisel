import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import Sharing from 'components/mainArea/sharing/Sharing';
import {ROLE_OWNER, ROLE_ADMIN} from 'models/UserData';
import {addCollaboration, updateCollaboration, deleteCollaboration, deleteSelfCollaboration} from 'ducks/models';
import {showAlert} from 'ducks/nav';


export class SharingContainer extends Component  {
  render() {
    const {models, nav, user} = this.props;
    const {addCollaboration, updateCollaboration, deleteCollaboration, deleteSelfCollaboration} = this.props.modelsActions;
    const {showAlert} = this.props.navActions;
    
    let curSite = models.currentSite;
    if (!curSite)
      return null;
  
    return <Sharing collaborations={curSite.collaborations}
                    owner={curSite.owner}
                    user={user.userData}
                    addCollaboration={addCollaboration}
                    updateCollaboration={updateCollaboration}
                    deleteCollaboration={deleteCollaboration}
                    deleteSelfCollaboration={deleteSelfCollaboration}
                    showAlert={showAlert}
                    alertShowing={nav.alertShowing}
                    isEditable={models.role == ROLE_OWNER || models.role == ROLE_ADMIN} />;
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
    modelsActions:  bindActionCreators({addCollaboration, updateCollaboration, deleteCollaboration, deleteSelfCollaboration}, dispatch),
    navActions:     bindActionCreators({showAlert}, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SharingContainer);
