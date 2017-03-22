import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';

import Model from 'components/mainArea/models/Model/Model';
import {updateModel, deleteField} from 'ducks/models';
import {showAlert, closeModel, showModal} from 'ducks/nav';

import styles from './ModelContainer.sss';


@CSSModules(styles, {allowMultiple: true})
export class ModelContainer extends Component  {
  render() {
    const {models, nav} = this.props;
    const {updateModel, deleteField} = this.props.modelsActions;
    const {showAlert, closeModel, showModal} = this.props.navActions;
    
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
    modelsActions:  bindActionCreators({updateModel, deleteField}, dispatch),
    navActions:     bindActionCreators({showAlert, closeModel, showModal}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModelContainer);
