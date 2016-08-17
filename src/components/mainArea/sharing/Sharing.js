import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';
import Gravatar from 'react-gravatar'

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
              <div styleName="avatar">
                <Gravatar email="hello@keiransell.com" styleName="gravatar"/>
              </div>
              <div styleName="type">
                <div styleName="name">Keir Ansell</div>
                <div styleName="email">hello@keiransell.com</div>
              </div>
              <div styleName="owner">
                OWNER
              </div>
            </div>

            <div styleName="list-item">
              <div styleName="avatar">
                <Gravatar email="stevebschofield@gmail.com" styleName="gravatar"/>
              </div>
              <div styleName="type">
                <div styleName="name">Steve Schofield</div>
                <div styleName="email">stevebschofield@gmail.com</div>
              </div>
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
