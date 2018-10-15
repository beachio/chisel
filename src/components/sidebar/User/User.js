import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';
import Gravatar from 'react-gravatar';
import {Link} from 'react-router';

import {URL_USERSPACE, URL_PROFILE} from 'ducks/nav';

import styles from './User.sss';


@CSSModules(styles, {allowMultiple: true})
export default class User extends Component {
  render() {
    const {userData} = this.props;

    let link = `/${URL_USERSPACE}/${URL_PROFILE}/`;
    
    let name = userData.email;
    if (userData.firstName || userData.lastName)
      name = `${userData.firstName} ${userData.lastName}`;
    
    return (
      <Link styleName="user" to={link} activeClassName={styles.activeBla}>
        <div styleName="profile">
          <div styleName="avatar">
            <Gravatar email={userData.email} styleName="gravatar"/>
          </div>
          <div styleName="avatar-name">
            {name}
          </div>
        </div>
        <div styleName="settings">
          <InlineSVG src={require("./settings.svg")} />
        </div>
      </Link>
    );
  }
}
