import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';
import {push} from 'react-router-redux';

import Model from 'components/mainArea/models/Model/Model';
import {updateModel, deleteField} from 'ducks/models';
import {showAlert, showModal} from 'ducks/nav';
import {USERSPACE_URL, SITE_URL, MODELS_URL, MODEL_URL} from 'middleware/routing';

import styles from './ModelContainer.sss';


@CSSModules(styles, {allowMultiple: true})
export class ModelContainer extends Component  {
  render() {
    const {models, nav} = this.props;
    const {updateModel, deleteField} = this.props.modelsActions;
    const {showAlert, showModal} = this.props.navActions;
    const {push} = this.props.routerActions;
  
    let curSite = models.currentSite;
    
    let closeModel = () => {
      let siteNameId = curSite.nameId;
      push(`${USERSPACE_URL}${SITE_URL}${siteNameId}${MODELS_URL}`);
    };
    
    return <Model model={models.currentModel}
                  onClose={closeModel}
                  updateModel={updateModel}
                  deleteField={deleteField}
                  showAlert={showAlert}
                  showModal={showModal}
                  modalShowing={nav.modalShowing}
                  alertShowing={nav.alertShowing}
                  isEditable={true}/>;
  }
}

function mapStateToProps(state) {
  return {
    models:   state.models,
    nav:      state.nav
  };
}

function mapDispatchToProps(dispatch) {
  return {
    modelsActions: bindActionCreators({updateModel, deleteField}, dispatch),
    navActions: bindActionCreators({showAlert, showModal}, dispatch),
    routerActions: bindActionCreators({push}, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModelContainer);
