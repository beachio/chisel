import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';
import {push} from 'react-router-redux';

import ModelsList from 'components/mainArea/models/ModelsList/ModelsList';
import {addModel, deleteModel} from 'ducks/models';
import {showAlert} from 'ducks/nav';
import {USERSPACE_URL, SITE_URL, MODELS_URL, MODEL_URL} from 'middleware/routing';

import styles from './ModelsListContainer.sss';


@CSSModules(styles, {allowMultiple: true})
export class ModelsListContainer extends Component  {
  render() {
    const {models, nav} = this.props;
    const {addModel, deleteModel} = this.props.modelsActions;
    const {showAlert} = this.props.navActions;
    const {push} = this.props.routerActions;
    
    let curSite = models.currentSite;
    
    let gotoModel = model => {
      let siteNameId = curSite.nameId;
      let modelNameId = model.nameId;
      push(`${USERSPACE_URL}${SITE_URL}${siteNameId}${MODELS_URL}${MODEL_URL}${modelNameId}`);
    };
    
    return <ModelsList models={curSite.models}
                       gotoModel={gotoModel}
                       addModel={addModel}
                       deleteModel={deleteModel}
                       showAlert={showAlert}
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
    modelsActions:  bindActionCreators({addModel, deleteModel}, dispatch),
    navActions:     bindActionCreators({showAlert}, dispatch),
    routerActions:  bindActionCreators({push}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModelsListContainer);
