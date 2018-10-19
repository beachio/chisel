import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import {Helmet} from "react-helmet";

import ModelsList from 'components/mainArea/models/ModelsList/ModelsList';
import {addModel, deleteModel} from 'ducks/models';
import {showAlert, URL_USERSPACE, URL_SITE, URL_MODELS, URL_MODEL} from 'ducks/nav';
import {ROLE_ADMIN, ROLE_OWNER} from 'models/UserData';
import {NoRights} from "components/mainArea/common/NoRights";


export class ModelsListContainer extends Component {
  mainArea;
  lastScroll = 0;

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
    const {addModel, deleteModel} = this.props.modelsActions;
    const {showAlert} = this.props.navActions;
    
    let title = `Chisel`;
    let content = <NoRights />;

    const site = models.currentSite;
    if (site) {
      title = `Models - Site: ${site.name} - Chisel`;
      const gotoModel = model => browserHistory.push(
        `/${URL_USERSPACE}/${URL_SITE}${site.nameId}/${URL_MODELS}/${URL_MODEL}${model.nameId}`);
      const role = models.role;
      if (role == ROLE_ADMIN || role == ROLE_OWNER)
        content = (
          <ModelsList site={site}
                      gotoModel={gotoModel}
                      addModel={addModel}
                      keepScroll={this.keepScroll}
                      deleteModel={deleteModel}
                      showAlert={showAlert}
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
    modelsActions:  bindActionCreators({addModel, deleteModel}, dispatch),
    navActions:     bindActionCreators({showAlert}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModelsListContainer);
