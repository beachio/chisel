import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';
import Gravatar from 'react-gravatar';
import {Link} from 'react-router';

import {URL_USERSPACE, URL_PROFILE} from 'ducks/nav';

import styles from './User.sss';


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
        <div styleName={`user ${this.state.isAccountOpened ? 'user-active' : ''}`} onClick={this.toggleAccountMenu}>
          <div styleName="profile">
            <div styleName="avatar-name">{name}</div>

            
              <div styleName="avatar">
                <Gravatar email={userData.email} styleName="gravatar"/>
              </div>
          </div>

          <div styleName="arrow">
            <InlineSVG src={require("./arrow-down.svg")} />
          </div>
        </div>
        
        {this.state.isAccountOpened &&
          <div styleName="submenu">
            <Link
                activeClassName={styles.activeBla}
                to={`/${URL_USERSPACE}/${URL_PROFILE}/`}
              >
              <div styleName="logout">
                <InlineSVG styleName="logout-icon" src={require("./avatar.svg")} />
                Profile
              </div>
            </Link>
            <div styleName="logout" onClick={logoutHandler}>
              <InlineSVG styleName="logout-icon" src={require("./logout.svg")} />
              Log out
            </div>
          </div>
        }
      </div>
      
    );
  }
}
