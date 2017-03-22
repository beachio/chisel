import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';

import Sharing from 'components/mainArea/sharing/Sharing';
import {ROLE_OWNER, ROLE_ADMIN} from 'models/UserData';
import {addCollaboration, updateCollaboration, deleteCollaboration, deleteSelfCollaboration} from 'ducks/models';
import {showAlert} from 'ducks/nav';
import InlineSVG from 'svg-inline-react';

import styles from './SharingContainer.sss';


@CSSModules(styles, {allowMultiple: true})
export class SharingContainer extends Component  {
  render() {
    const {models, nav, user} = this.props;
    const {addCollaboration, updateCollaboration, deleteCollaboration, deleteSelfCollaboration} = this.props.modelsActions;
    const {showAlert} = this.props.navActions;
    
    let curSite = models.currentSite;
    
    let component = (
      <div styleName="start-working">
        <InlineSVG styleName="hammer" src={require("./hammer.svg")}/>
        Add new site to start working
        <div styleName="hint">Find "Add new site" button at sidebar</div>
      </div>
    );
    
    if (curSite)
      component = (
        <Sharing collaborations={curSite.collaborations}
                 owner={curSite.owner}
                 user={user.userData}
                 addCollaboration={addCollaboration}
                 updateCollaboration={updateCollaboration}
                 deleteCollaboration={deleteCollaboration}
                 deleteSelfCollaboration={deleteSelfCollaboration}
                 showAlert={showAlert}
                 alertShowing={nav.alertShowing}
                 isEditable={models.role == ROLE_OWNER || models.role == ROLE_ADMIN} />
      );
    
    return component;
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
