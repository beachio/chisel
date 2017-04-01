import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';

import ModelsList from 'components/mainArea/models/ModelsList/ModelsList';
import {addModel, deleteModel} from 'ducks/models';
import {showAlert} from 'ducks/nav';
import {USERSPACE_URL, SITE_URL, MODELS_URL, MODEL_URL} from 'middleware/routing';


export class ModelsListContainer extends Component  {
  render() {
    const {models, nav} = this.props;
    const {addModel, deleteModel} = this.props.modelsActions;
    const {showAlert} = this.props.navActions;
    
    let curSite = models.currentSite;
    if (!curSite)
      return null;
    
    let gotoModel = model => browserHistory.push(
      `${USERSPACE_URL}${SITE_URL}${curSite.nameId}${MODELS_URL}${MODEL_URL}${model.nameId}`);
    
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
    navActions:     bindActionCreators({showAlert}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModelsListContainer);
