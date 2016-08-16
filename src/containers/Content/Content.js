import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';

import styles from './Content.sss';

import ModelsList from 'components/content/models/ModelsList/ModelsList';
import Model from 'components/content/models/Model/Model';
import {addModel, setCurrentModel, addField} from 'ducks/models';
import {closeModel} from 'ducks/nav';


@CSSModules(styles, {allowMultiple: true})
export default class Content extends Component  {
  render() {
    const {models, nav} = this.props;
    const {addModel, setCurrentModel, addField} = this.props.modelsActions;
    const {closeModel} = this.props.navActions;

    let modelsList = models.currentSite ? models.currentSite.models : [];
    let Content = (
      <ModelsList models={modelsList}
                  setCurrentModel={setCurrentModel}
                  addModel={addModel} />
    );

    if (nav.openedModel)
      Content = (
        <Model model={models.currentModel}
               onClose={closeModel}
               addField={addField} />
      );

    return (
      <div styleName="content">
        {Content}
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

export default connect(mapStateToProps, mapDispatchToProps)(Content);
