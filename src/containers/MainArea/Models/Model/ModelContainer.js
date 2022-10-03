import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Helmet} from "react-helmet-async";

import Model from 'components/mainArea/models/Model/Model';
import {setCurrentModel, updateModel, updateField, deleteField} from 'ducks/models';
import {showAlert, showModal, URL_USERSPACE, URL_SITE, URL_MODELS, URL_MODEL} from 'ducks/nav';
import {getModelByNameId} from 'utils/data';
import {withRouter} from 'utils/routing';
import {ROLE_ADMIN, ROLE_OWNER} from 'models/UserData';
import NoRights from "components/mainArea/common/NoRights";


export class ModelContainer extends Component  {
  // TODO: костыль!
  model = null;

  //on mount: get model ID from URL, then send action "setCurrentModel"
  constructor(props) {
    super(props);

    const modelId = props.router.params.model;

    const {setCurrentModel} = props.modelsActions;
    const {models} = props;
    this.model = models.currentModel;

    const model = getModelByNameId(modelId);
    if (model && model != this.model) {
      this.model = model;
      setCurrentModel(model);
    }
  }

  render() {
    const {models, nav} = this.props;
    const {updateModel, updateField, deleteField} = this.props.modelsActions;
    const {showAlert, showModal} = this.props.navActions;

    let title = `Chisel`;
    let content = nav.initEnded ? <NoRights /> : null;

    const site = models.currentSite;
    const model = this.model;

    if (site && model && (models.role == ROLE_ADMIN || models.role == ROLE_OWNER)) {
      title = `Model: ${model.name} - Site: ${site.name} - Chisel`;

      const gotoList = () => this.props.router.navigate(
        `/${URL_USERSPACE}/${URL_SITE}${site.nameId}/${URL_MODELS}`);

      content = (
        <Model model={model}
               gotoList={gotoList}
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

    return <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {content}
    </>;
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ModelContainer));
