import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import {Helmet} from "react-helmet";

import ModelsList from 'components/mainArea/models/ModelsList/ModelsList';
import {addModel, deleteModel} from 'ducks/models';
import {showAlert, USERSPACE_URL, SITE_URL, MODELS_URL, MODEL_URL} from 'ducks/nav';
import {ROLE_ADMIN, ROLE_OWNER} from 'models/UserData';
import {NoRights} from "components/mainArea/common/NoRights";


export class ModelsListContainer extends Component  {
  render() {
    const {models, nav} = this.props;
    const {addModel, deleteModel} = this.props.modelsActions;
    const {showAlert} = this.props.navActions;
    
    let title = `Chisel`;
    let content = <NoRights key="container" />;

    const curSite = models.currentSite;
    if (curSite) {
      title = `Models - Site: ${curSite.name} - Chisel`;

      const gotoModel = model => browserHistory.push(
        `/${USERSPACE_URL}/${SITE_URL}${curSite.nameId}/${MODELS_URL}/${MODEL_URL}${model.nameId}`);

      const role = models.role;
      if (role == ROLE_ADMIN || role == ROLE_OWNER)
        content = (
          <ModelsList key="container"
                      site={curSite}
                      gotoModel={gotoModel}
                      addModel={addModel}
                      deleteModel={deleteModel}
                      showAlert={showAlert}
                      alertShowing={nav.alertShowing}
                      isEditable={true}/>
        );
    }
    
    return [
      <Helmet key="helmet">
        <title>{title}</title>
      </Helmet>,
      content
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
    modelsActions:  bindActionCreators({addModel, deleteModel}, dispatch),
    navActions:     bindActionCreators({showAlert}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModelsListContainer);
