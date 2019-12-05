import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import {Helmet} from "react-helmet-async";

import ModelsList from 'components/mainArea/models/ModelsList/ModelsList';
import {addModel, deleteModel} from 'ducks/models';
import {showAlert, URL_USERSPACE, URL_SITE, URL_MODELS, URL_MODEL} from 'ducks/nav';
import {ROLE_ADMIN, ROLE_OWNER} from 'models/UserData';
import {NoRights} from "components/mainArea/common/NoRights";


export class ModelsListContainer extends Component {
  render() {
    const {models, nav} = this.props;
    const {addModel, deleteModel} = this.props.modelsActions;
    const {showAlert} = this.props.navActions;
    
    let title = `Chisel`;
    let content = <NoRights key="content" />;

    const site = models.currentSite;
    if (site && (models.role == ROLE_ADMIN || models.role == ROLE_OWNER)) {
      title = `Models - Site: ${site.name} - Chisel`;
      const gotoModel = model => browserHistory.push(
        `/${URL_USERSPACE}/${URL_SITE}${site.nameId}/${URL_MODELS}/${URL_MODEL}${model.nameId}`);
      content = (
        <ModelsList key="content"
                    site={site}
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
