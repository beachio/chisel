import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';

import Menu from 'components/header/Menu/Menu';
import User from 'components/sidebar/User/User';
import {logout} from 'ducks/user';
import {toggleSidebar} from 'ducks/nav';

import styles from './Header.sss';

import ImageIconSidebar from 'assets/images/icons/sidebar.svg';


@CSSModules(styles, {allowMultiple: true})
export class Header extends Component  {
  render() {
    const {models, nav} = this.props;
    const {userData} = this.props.user;
    const {logout} = this.props.userActions;
    const {toggleSidebar} = this.props.sidebarActions;

    let nameId = models.currentSite ? models.currentSite.nameId : null;

    return (
      <div styleName="header">
        <div styleName="sidebar-icon" onClick={toggleSidebar}>
          <InlineSVG src={ImageIconSidebar} />
        </div>
        <Menu siteNameId={nameId}
              isSidebarOpened={nav.isSidebarVisible}
              openedPage={nav.openedPage} />
        <User userData={userData} logoutHandler={logout} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    models: state.models,
    user: state.user,
    nav: state.nav,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    userActions: bindActionCreators({logout}, dispatch),
    sidebarActions: bindActionCreators({toggleSidebar}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
