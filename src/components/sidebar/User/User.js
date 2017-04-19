import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';
import Gravatar from 'react-gravatar';
import {Link} from 'react-router';

import {USERSPACE_URL, PROFILE_URL} from 'ducks/nav';

import styles from './User.sss';


@CSSModules(styles, {allowMultiple: true})
export default class User extends Component {
  render() {
    const {userData} = this.props;

    let link = `/${USERSPACE_URL}/${PROFILE_URL}/`;
    
    let name = userData.email;
    if (userData.firstName || userData.lastName)
      name = `${userData.firstName} ${userData.lastName}`;
    
    return (
      <div styleName="user">
        <Link styleName="profile" to={link} activeClassName={styles.activeBla}>
          <div styleName="avatar">
            <Gravatar email={userData.email} styleName="gravatar"/>
          </div>
          <div styleName="avatar-name">
            {name}
          </div>
        </Link>
        <div styleName="settings">
          <InlineSVG src={require("./settings.svg")} />
        </div>
      </div>
    );
  }
}
