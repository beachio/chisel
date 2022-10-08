import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Helmet} from "react-helmet-async";

import Sharing from 'components/mainArea/sharing/Sharing';
import {ROLE_OWNER, ROLE_ADMIN} from 'models/UserData';
import {addCollaboration, addInviteCollaboration, updateCollaboration, deleteCollaboration, deleteSelfCollaboration}
  from 'ducks/models';
import {showAlert, showModal} from 'ducks/nav';


function SharingContainer(props)  {
  const {models, nav, user} = props;
  const {addCollaboration, addInviteCollaboration, updateCollaboration, deleteCollaboration, deleteSelfCollaboration} =
    props.modelsActions;
  const {showAlert, showModal} = props.navActions;

  let site = models.currentSite;
  if (!site)
    return null;

  let title = `Sharing - Site: ${site.name} - Chisel`;

  return <>
    <Helmet>
      <title>{title}</title>
    </Helmet>
    <Sharing collaborations={site.collaborations}
             owner={site.owner}
             user={user.userData}
             addCollaboration={addCollaboration}
             addInviteCollaboration={addInviteCollaboration}
             updateCollaboration={updateCollaboration}
             deleteCollaboration={deleteCollaboration}
             deleteSelfCollaboration={deleteSelfCollaboration}
             showAlert={showAlert}
             showModal={showModal}
             alertShowing={nav.alertShowing}
             modalShowing={nav.modalShowing}
             isEditable={models.role == ROLE_OWNER || models.role == ROLE_ADMIN} />
  </>;
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
    navActions:     bindActionCreators({showAlert, showModal}, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SharingContainer);
