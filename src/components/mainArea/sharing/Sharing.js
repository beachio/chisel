import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';
import Gravatar from 'react-gravatar'

import styles from './Sharing.sss';


@CSSModules(styles, {allowMultiple: true})
export default class Sharing extends Component {
  render() {
    return (
      <div styleName="wrapper">
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

        <div styleName="import">
          <div className="g-title" styleName="title">
            Import Contacts
          </div>

          <div styleName="description">
            If you would like to invite your contacts, select the service below.
          </div>

          <div styleName="contacts">
            <div styleName="contacts-item">
              <div styleName="icon-wrapper">
                <InlineSVG styleName="icon" src={require("./slack.svg")} />
              </div>
              Slack
            </div>
            <div styleName="contacts-item">
              <div styleName="icon-wrapper">
                <InlineSVG styleName="icon" src={require("./github.svg")} />
              </div>
              Github
            </div>
            <div styleName="contacts-item">
              <div styleName="icon-wrapper">
                <InlineSVG styleName="icon icon-bucket" src={require("./bitbucket.svg")} />
              </div>
              Bitbucket
            </div>
          </div>
        </div>
      </div>
    );
  }
}
