import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import {Helmet} from "react-helmet";

import Model from 'components/mainArea/models/Model/Model';
import {setCurrentModel, updateModel, deleteField} from 'ducks/models';
import {showAlert, showModal} from 'ducks/nav';
import {USERSPACE_URL, SITE_URL, MODELS_URL, MODEL_URL} from 'middleware/routing';
import {getModelByNameId} from 'utils/data';


export class ModelContainer extends Component  {
  //TODO Костыль!
  model = null;
  
  componentWillMount() {
    const MODEL = 'model~';
  
    let modelId = this.props.params.model;
    if (modelId.indexOf(MODEL) != 0)
      return;
  
    modelId = modelId.slice(MODEL.length);
  
    const {setCurrentModel} = this.props.modelsActions;
    const {models} = this.props;
    
    this.model = models.currentModel;
    if (!this.model || modelId != this.model.nameId) {
      let newModel = getModelByNameId(modelId);
      if (newModel) {
        setCurrentModel(newModel);
        this.model = newModel;
      }
    }
  }
  
  render() {
    const {models, nav} = this.props;
    const {updateModel, deleteField} = this.props.modelsActions;
    const {showAlert, showModal} = this.props.navActions;
    
    let curSite = models.currentSite;
    if (!curSite)
      return null;
    
    let title = `Model: ${this.model.name} - Site: ${curSite.name} - Chisel`;
    
    let closeModel = () => browserHistory.push(
      `${USERSPACE_URL}${SITE_URL}${curSite.nameId}${MODELS_URL}`);
    
    return (
      <div className="mainArea">
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <Model model={this.model}
               onClose={closeModel}
               updateModel={updateModel}
               deleteField={deleteField}
               showAlert={showAlert}
               showModal={showModal}
               modalShowing={nav.modalShowing}
               alertShowing={nav.alertShowing}
               isEditable={true}/>
      </div>
    );
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
    modelsActions: bindActionCreators({setCurrentModel, updateModel, deleteField}, dispatch),
    navActions: bindActionCreators({showAlert, showModal}, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModelContainer);
