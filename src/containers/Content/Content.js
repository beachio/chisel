import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';

import styles from './Content.sss';
import Menu from 'components/header/Menu/Menu';

import {openPage} from 'ducks/nav';


@CSSModules(styles, {allowMultiple: true})
export default class Content extends Component  {
  componentWillReceiveProps(nextProps) {
  }
  
  render() {
    const {nav} = this.props;
    const {openPage} = this.props.modalActions;
    
    return (
      <div styleName="header">
        <Menu openPage={openPage} />
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
    navActions: bindActionCreators({openPage}, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Content);