import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';

import styles from './Header.sss';
import Menu from 'components/header/Menu/Menu';

import {openPage} from 'ducks/nav';



@CSSModules(styles, {allowMultiple: true})
export default class Header extends Component  {
  componentWillReceiveProps(nextProps) {
  }

  render() {
    const {nav} = this.props;
    const {openPage} = this.props.navActions;

    return (
      <div styleName="header">
        <a href="/" styleName="logo">
          <img src={require("./logo.png")} />
        </a>
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

export default connect(mapStateToProps, mapDispatchToProps)(Header);
