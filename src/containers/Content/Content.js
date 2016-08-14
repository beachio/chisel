import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';

import styles from './Content.sss';
import ModelsList from 'components/content/models/ModelsList/ModelsList';
import Model from 'components/content/models/Model/Model';

import {addModel} from 'ducks/models';


@CSSModules(styles, {allowMultiple: true})
export default class Content extends Component  {
  render() {
    const {models} = this.props;
    const {addModel} = this.props.modelsActions;

    return (
      <div styleName="content">
        <ModelsList modelsCurrent={models.modelsCurrent}
                    addModel={addModel} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    models: state.models
  };
}

function mapDispatchToProps(dispatch) {
  return {
    modelsActions: bindActionCreators({addModel}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Content);
