import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Helmet} from "react-helmet-async";
import {useNavigate} from 'react-router-dom';

import ModelsList from 'components/mainArea/models/ModelsList/ModelsList';
import {addModel, deleteModel} from 'ducks/models';
import {showAlert, URL_USERSPACE, URL_SITE, URL_MODELS, URL_MODEL} from 'ducks/nav';
import {ROLE_ADMIN, ROLE_OWNER} from 'models/UserData';
import NoRights from "components/mainArea/common/NoRights";


function ModelsListContainer(props) {
  const {models, nav} = props;
  const {addModel, deleteModel} = props.modelsActions;
  const {showAlert} = props.navActions;
  const navigate = useNavigate();

  let title = `Chisel`;
  let content = nav.initEnded ? <NoRights /> : null;

  const site = models.currentSite;
  if (site && (models.role == ROLE_ADMIN || models.role == ROLE_OWNER)) {
    title = `Models - Site: ${site.name} - Chisel`;
    const gotoModel = model => navigate(
      `/${URL_USERSPACE}/${URL_SITE}${site.nameId}/${URL_MODELS}/${URL_MODEL}${model.nameId}`);
    content = (
      <ModelsList site={site}
                  gotoModel={gotoModel}
                  addModel={addModel}
                  deleteModel={deleteModel}
                  showAlert={showAlert}
                  alertShowing={nav.alertShowing}
                  isEditable={true} />
    );
  }

  return <>
    <Helmet>
      <title>{title}</title>
    </Helmet>
    {content}
  </>;
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
