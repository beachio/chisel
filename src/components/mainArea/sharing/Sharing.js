import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';

import styles from './Sharing.sss';


@CSSModules(styles, {allowMultiple: true})
export default class Sharing extends Component {
  render() {
    return (
      <div className="g-container" styleName="Sharing">
        <div className="g-title">
          Collaborators
        </div>
        <div>
          <div styleName="list">

            <div styleName="list-item">
              <div styleName="colorLabel"></div>
              <div styleName="type">
                <div styleName="name">20 Best Things You May Be Searching For</div>
                <div styleName="description">Post</div>
              </div>
              <div styleName="updated">3 hours ago</div>
            </div>

            <div styleName="list-item">
              <div styleName="colorLabel"></div>
              <div styleName="type">
                <div styleName="name">About us</div>
                <div styleName="description">Page</div>
              </div>
              <div styleName="updated">24 Mar</div>
            </div>

          </div>
          <form styleName="create-new">
            <input styleName="input" placeholder="Enter one or more emails" />
            <InlineSVG styleName="users" src={require("./users.svg")} />
          </form>

          <div styleName="footer">
            If the recipient doesn’t yet have a Scrivener account, they will be sent an invitation to join.
          </div>
        </div>
      </div>
    );
  }
}
