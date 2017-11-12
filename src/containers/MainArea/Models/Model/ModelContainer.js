import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import {Helmet} from "react-helmet";

import Model from 'components/mainArea/models/Model/Model';
import {setCurrentModel, updateModel, updateField, deleteField} from 'ducks/models';
import {showAlert, showModal, USERSPACE_URL, SITE_URL, MODELS_URL, MODEL_URL} from 'ducks/nav';
import {getModelByNameId} from 'utils/data';


export class ModelContainer extends Component  {
  //on mount: get model ID from URL, then send action "setCurrentModel"
  componentWillMount() {
    let modelId = this.props.params.model;
    if (modelId.indexOf(MODEL_URL) != 0)
      return;
  
    modelId = modelId.slice(MODEL_URL.length);
  
    const {setCurrentModel} = this.props.modelsActions;
    const {models} = this.props;
    
    let model = models.currentModel;
    if (!model || modelId != model.nameId) {
      const newModel = getModelByNameId(modelId);
      if (newModel)
        setCurrentModel(newModel);
    }
  }
  
  render() {
    const {models, nav} = this.props;
    const {updateModel, updateField, deleteField} = this.props.modelsActions;
    const {showAlert, showModal} = this.props.navActions;
    
    let curSite = models.currentSite;
    let model = models.currentModel;
    if (!curSite || !model)
      return null;

    let title = `Model: ${model.name} - Site: ${curSite.name} - Chisel`;
    
    let closeModel = () => browserHistory.push(
      `/${USERSPACE_URL}/${SITE_URL}${curSite.nameId}/${MODELS_URL}`);
    
    return [
      <Helmet key="helmet">
        <title>{title}</title>
      </Helmet>,
      <Model key="container"
             model={model}
             onClose={closeModel}
             updateModel={updateModel}
             updateField={updateField}
             deleteField={deleteField}
             showAlert={showAlert}
             showModal={showModal}
             modalShowing={nav.modalShowing}
             alertShowing={nav.alertShowing}
             isEditable={true}/>
    ];
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
    modelsActions: bindActionCreators({setCurrentModel, updateModel, updateField, deleteField}, dispatch),
    navActions: bindActionCreators({showAlert, showModal}, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModelContainer);
