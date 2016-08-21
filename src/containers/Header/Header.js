import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';

import Menu from 'components/header/Menu/Menu';
import {openPage} from 'ducks/nav';

import styles from './Header.sss';


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
        <Menu openedPage={nav.openedPage}
              openPage={openPage} />
        <div styleName="logout">
          Log out
          <InlineSVG styleName="logout-icon" src={require("./logout.svg")} />
        </div>
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
