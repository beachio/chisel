import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import {Helmet} from "react-helmet";

import ModelsList from 'components/mainArea/models/ModelsList/ModelsList';
import {addModel, deleteModel} from 'ducks/models';
import {showAlert, USERSPACE_URL, SITE_URL, MODELS_URL, MODEL_URL} from 'ducks/nav';


export class ModelsListContainer extends Component  {
  render() {
    const {models, nav} = this.props;
    const {addModel, deleteModel} = this.props.modelsActions;
    const {showAlert} = this.props.navActions;
    
    let curSite = models.currentSite;
    if (!curSite)
      return null;
    
    let title = `Models - Site: ${curSite.name} - Chisel`;
    
    let gotoModel = model => browserHistory.push(
      `/${USERSPACE_URL}/${SITE_URL}${curSite.nameId}/${MODELS_URL}/${MODEL_URL}${model.nameId}`);
    
    return (
      <div className="mainArea">
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <ModelsList site={curSite}
                    gotoModel={gotoModel}
                    addModel={addModel}
                    deleteModel={deleteModel}
                    showAlert={showAlert}
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
    modelsActions:  bindActionCreators({addModel, deleteModel}, dispatch),
    navActions:     bindActionCreators({showAlert}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModelsListContainer);
