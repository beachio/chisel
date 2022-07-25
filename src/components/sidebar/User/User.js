import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';
import Gravatar from 'react-gravatar';
import {NavLink} from 'react-router-dom';

import {URL_USERSPACE, URL_PROFILE} from 'ducks/nav';

import styles from './User.sss';

import ImageArrowDown from "./arrow-down.svg";
import ImageAvatar from "./avatar.svg";
import ImageLogout from "./logout.svg";



@CSSModules(styles, {allowMultiple: true})
export default class User extends Component {
  state = {
    isAccountOpened: false
  };

  toggleAccountMenu = () => this.setState({
    isAccountOpened: !this.state.isAccountOpened
  });

  closeAccountMenu = () => {
    if (this.state.isAccountOpened)
      setTimeout(() => this.setState({isAccountOpened: false}), 200);
  };

  render() {
    const {userData, logoutHandler} = this.props;

    let name = userData.email;
    if (userData.firstName || userData.lastName)
      name = `${userData.firstName} ${userData.lastName}`;

    return (
      <div styleName="wrapper" onBlur={this.closeAccountMenu} tabIndex="0">
        <div styleName={`user ${this.state.isAccountOpened ? 'userActive' : ''}`} onClick={this.toggleAccountMenu}>
          <div styleName="profile">
            <div styleName="avatar-name">{name}</div>
              <div styleName="avatar">
                <Gravatar protocol="https://" email={userData.email} styleName="gravatar"/>
              </div>
          </div>

          <div styleName="arrow">
            <InlineSVG src={ImageArrowDown} />
          </div>
        </div>
        
        {this.state.isAccountOpened &&
          <div styleName="submenu">
            <NavLink
                activeClassName={styles.userActive}
                to={`/${URL_USERSPACE}/${URL_PROFILE}/`}
              >
              <div styleName="logout">
                <InlineSVG styleName="logout-icon" src={ImageAvatar} />
                Profile
              </div>
            </NavLink>
            <div styleName="logout" onClick={logoutHandler}>
              <InlineSVG styleName="logout-icon" src={ImageLogout} />
              Log out
            </div>
          </div>
        }
      </div>
      
    );
  }
}
