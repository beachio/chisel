import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';
import Gravatar from 'react-gravatar';

import styles from './User.sss';


@CSSModules(styles, {allowMultiple: true})
export default class User extends Component {
  render() {
    const {userData} = this.props;

    return (
      <div styleName="user">
        <div styleName="profile">
          <div styleName="avatar">
            <Gravatar email={userData.email} styleName="gravatar"/>
          </div>
          <div styleName="avatar-name">
            {userData.firstName} {userData.lastName}
          </div>
        </div>
        <div styleName="settings">
          <InlineSVG src={require("./settings.svg")} />
        </div>
      </div>
    );
  }
}
