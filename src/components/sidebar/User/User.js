import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';
import Gravatar from 'react-gravatar';
import {Link} from 'react-router';

import {URL_USERSPACE, URL_PROFILE} from 'ducks/nav';

import styles from './User.sss';

@CSSModules(styles, {allowMultiple: true})
export default class User extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAccountOpened: false
    }
  }

  toggleAccountMenu = () => this.setState({
    isAccountOpened: !this.state.isAccountOpened
  })

  render() {
    const {userData, logoutHandler} = this.props;

    let name = userData.email;
    if (userData.firstName || userData.lastName)
      name = `${userData.firstName} ${userData.lastName}`;

    return (
      <div styleName="wrapper">
        <div styleName="user" onClick={this.toggleAccountMenu}>
          <div styleName="profile">
            <div styleName="avatar-name">{name}</div>

            <Link
              activeClassName={styles.activeBla}
              to={`/${URL_USERSPACE}/${URL_PROFILE}/`}
            >
              <div styleName="avatar">
                <Gravatar email={userData.email} styleName="gravatar"/>
              </div>
            </Link>
          </div>

          <div styleName="arrow">
            <InlineSVG src={require("./arrow-down.svg")} />
          </div>
        </div>
        
        {
          this.state.isAccountOpened && 
            <div styleName="submenu">
              <div styleName="logout" onClick={logoutHandler}>
                Log out
                <InlineSVG styleName="logout-icon" src={require("./logout.svg")} />
              </div>
            </div>
        }
      </div>
      
    );
  }
}
