import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';

import styles from './MainArea.sss';

import ModelsList from 'components/mainArea/models/ModelsList/ModelsList';
import ContentList from 'components/mainArea/content/ContentList/ContentList';
import Sharing from 'components/mainArea/sharing/Sharing';
import Model from 'components/mainArea/models/Model/Model';
import {addModel, setCurrentModel, addField} from 'ducks/models';
import {PAGE_MODELS, PAGE_CONTENT, PAGE_API, PAGE_SETTINGS, PAGE_SHARING, closeModel} from 'ducks/nav';


@CSSModules(styles, {allowMultiple: true})
export default class MainArea extends Component  {
  render() {
    const {models, nav} = this.props;

    let Area;
    switch (nav.openedPage) {
      case PAGE_MODELS:
        const {addModel, setCurrentModel, addField} = this.props.modelsActions;
        const {closeModel} = this.props.navActions;

        let modelsList = models.currentSite ? models.currentSite.models : [];
        Area = (
          <ModelsList models={modelsList}
                      setCurrentModel={setCurrentModel}
                      addModel={addModel} />
        );

        if (nav.openedModel)
          Area = (
            <Model model={models.currentModel}
                   onClose={closeModel}
                   addField={addField} />
          );

        break;

      case PAGE_CONTENT:
        Area = (
          <ContentList />
        );

      case PAGE_SHARING:
        Area = (
          <Sharing />
        );
    }

    return (
      <div styleName="mainArea">
        {Area}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    models: state.models,
    nav:    state.nav
  };
}

function mapDispatchToProps(dispatch) {
  return {
    modelsActions:  bindActionCreators({addModel, setCurrentModel, addField}, dispatch),
    navActions:     bindActionCreators({closeModel}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MainArea);
