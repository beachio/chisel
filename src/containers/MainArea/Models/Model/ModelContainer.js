import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import {Helmet} from "react-helmet";

import Model from 'components/mainArea/models/Model/Model';
import {setCurrentModel, updateModel, updateField, deleteField} from 'ducks/models';
import {showAlert, showModal, USERSPACE_URL, SITE_URL, MODELS_URL, MODEL_URL} from 'ducks/nav';
import {getModelByNameId} from 'utils/data';
import {ROLE_ADMIN, ROLE_OWNER} from 'models/UserData';
import {NoRights} from "components/mainArea/common/NoRights";


export class ModelContainer extends Component  {
  mainArea;
  lastScroll = 0;

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

  componentDidMount() {
    this.mainArea.scrollTop = 0;
    this.mainArea.addEventListener('scroll', this.onScroll);
  }

  onScroll = () => {
    this.lastScroll = this.mainArea.scrollTop;
  };

  componentWillUnmount() {
    this.mainArea.removeEventListener('scroll', this.onScroll);
  }

  keepScroll = () => {
    this.mainArea.scrollTop = this.lastScroll;
  };
  
  render() {
    const {models, nav} = this.props;
    const {updateModel, updateField, deleteField} = this.props.modelsActions;
    const {showAlert, showModal} = this.props.navActions;
    
    let title = `Chisel`;
    let content = <NoRights />;

    const curSite = models.currentSite;
    const model = models.currentModel;
    if (curSite && model) {
      title = `Model: ${model.name} - Site: ${curSite.name} - Chisel`;

      const closeModel = () => browserHistory.push(
        `/${USERSPACE_URL}/${SITE_URL}${curSite.nameId}/${MODELS_URL}`);

      const role = models.role;
      if (role == ROLE_ADMIN || role == ROLE_OWNER)
        content = (
          <Model model={model}
                 onClose={closeModel}
                 keepScroll={this.keepScroll}
                 updateModel={updateModel}
                 updateField={updateField}
                 deleteField={deleteField}
                 showAlert={showAlert}
                 showModal={showModal}
                 modalShowing={nav.modalShowing}
                 alertShowing={nav.alertShowing}
                 isEditable={true}/>
        );
    }
    
    return (
      <div className="mainArea" ref={c => this.mainArea = c}>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        {content}
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
    modelsActions: bindActionCreators({setCurrentModel, updateModel, updateField, deleteField}, dispatch),
    navActions: bindActionCreators({showAlert, showModal}, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModelContainer);
