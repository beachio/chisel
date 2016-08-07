import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';

import styles from './Content.sss';
import ModelsList from 'components/content/models/ModelsList/ModelsList';

import {openPage} from 'ducks/nav';


@CSSModules(styles, {allowMultiple: true})
export default class Content extends Component  {
  componentWillReceiveProps(nextProps) {
  }

  render() {
    const {nav} = this.props;
    const {openPage} = this.props.navActions;

    return (
      <div styleName="content">
        <ModelsList />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    nav:  state.nav
  };
}

function mapDispatchToProps(dispatch) {
  return {
    navActions: bindActionCreators({openPage}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Content);
