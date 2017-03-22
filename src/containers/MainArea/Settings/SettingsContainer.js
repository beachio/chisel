import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';

import Settings from 'components/mainArea/settings/Settings';
import {ROLE_OWNER, ROLE_ADMIN} from 'models/UserData';
import {updateSite, deleteSite} from 'ducks/models';
import {showAlert} from 'ducks/nav';
import InlineSVG from 'svg-inline-react';

import styles from './SettingsContainer.sss';


@CSSModules(styles, {allowMultiple: true})
export class SettingsContainer extends Component  {
  render() {
    const {models} = this.props;
    const {updateSite, deleteSite} = this.props.modelsActions;
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
        <Settings site={curSite}
                  updateSite={updateSite}
                  deleteSite={deleteSite}
                  showAlert={showAlert}
                  isEditable={models.role == ROLE_OWNER || models.role == ROLE_ADMIN} />
      );
    
    return component;
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
