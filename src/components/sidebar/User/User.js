import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';

import styles from './User.sss';


@CSSModules(styles, {allowMultiple: true})
export default class User extends Component {
  componentDidMount() {
  }

  render() {
    const {userData} = this.props;
    const imgUrl = 'https://s3.amazonaws.com/uifaces/faces/twitter/zeldman/128.jpg'; /// it needs to receive url from gravatar

    return (
      <div styleName="user">
        <div styleName="profile">
          <div styleName="avatar">
            <div styleName="avatar-image" style={{backgroundImage: 'url(' + imgUrl + ')'}}></div>
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
