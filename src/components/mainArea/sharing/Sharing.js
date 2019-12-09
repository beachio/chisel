import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';
import Gravatar from 'react-gravatar';
import {Parse} from 'parse';
import FlipMove from 'react-flip-move';

import {getUser, checkCollaboration, COLLAB_CORRECT, COLLAB_ERROR_EXIST, COLLAB_ERROR_SELF} from 'utils/data';
import {checkEmail} from 'utils/strings';
import ContainerComponent from 'components/elements/ContainerComponent/ContainerComponent';
import InputControl from 'components/elements/InputControl/InputControl';
import {ALERT_TYPE_CONFIRM} from 'components/modals/AlertModal/AlertModal';
import {MODAL_TYPE_ROLE} from "ducks/nav";

import styles from './Sharing.sss';

import ImageCrossCircle from 'assets/images/cross-circle.svg';


@CSSModules(styles, {allowMultiple: true})
export default class Sharing extends Component {
  state = {
    input: ""
  };

  activeInput = null;
  returnFocus = false;


  componentDidUpdate(prevProps) {
    if (!this.props.alertShowing && !this.props.modalShowing && this.activeInput && this.returnFocus) {
      this.returnFocus = false;
      setTimeout(() => this.activeInput.focus(), 1);
    }

    if (prevProps.collaborations != this.props.collaborations)
      this.setState({input: ""});
  }

  onInputChange = input => {
    this.setState({input});
  };

  onKeyDown = event => {
    if (this.props.alertShowing)
      return;

    //Enter pressed
    if (event.keyCode == 13) {
      this.onAddCollaboration();
      //Esc pressed
    } else if (event.keyCode == 27) {
      this.setState({input: ""});
    }
  };

  onAddCollaboration = event => {
    let email = this.state.input;
    if (!email)
      return;

    if (!checkEmail(email)) {
      this.props.showAlert({
        title: "Error",
        description: "The email is not correct!",
        buttonText: "OK"
      });
      this.returnFocus = true;
      return;
    }

    getUser(email)
      .then(user => {
        let error = checkCollaboration(user);

        switch (error) {
          case COLLAB_CORRECT:
            this.props.addCollaboration(user, email);
            this.setState({input: ``});
            break;

          case COLLAB_ERROR_SELF:
            this.props.showAlert({
              title: "Error",
              description: "You are trying to add yourself!",
              buttonText: "OK"
            });
            this.returnFocus = true;
            break;

          case COLLAB_ERROR_EXIST:
            this.props.showAlert({
              title: "Error",
              description: "This user already exists",
              buttonText: "OK"
            });
            this.returnFocus = true;
            break;
        }
      })
      .catch(error => {
        this.props.showAlert({
          type: ALERT_TYPE_CONFIRM,
          title: `New User`,
          description: `The user ${email} is not registered at Chisel. Would you like to send an invitation?`,
          onConfirm: () => this.props.addInviteCollaboration(email)
        });
        this.returnFocus = true;
        this.setState({input: ``});
      });
  };

  onRoleClick(e, collab) {
    e.stopPropagation();

    this.props.showModal(MODAL_TYPE_ROLE, {
      role: collab.role,
      callback: role => {
        collab.role = role;
        this.props.updateCollaboration(collab);
      }
    });
    this.returnFocus = true;
  }

  onDeleteClick(event, collab) {
    event.stopPropagation();

    let description = "This action cannot be undone. Type CONFIRM to complete";
    let delFunc = this.props.deleteCollaboration;
    let confirmString = 'CONFIRM';
    let user = collab.email;

    if (collab.user && collab.user.origin.id == Parse.User.current().id) {
      description = `You are trying to stop managing this site. ${description}<br><br>Please, type site name to confirm:`;
      delFunc = this.props.deleteSelfCollaboration;
      confirmString = collab.site.name;
      user = 'self';
    }

    this.props.showAlert({
      type: ALERT_TYPE_CONFIRM,
      title: `Deleting ${user} from collaborators`,
      description,
      confirmString,
      onConfirm: () => delFunc(collab)
    });
    this.returnFocus = true;
  }

  render() {
    const {owner, isEditable, collaborations} = this.props;
    const self = this.props.user;

    return (
      <div styleName="wrapper">
        <ContainerComponent title="Sharing">
          <div styleName="sharing-wrapper">
            <div styleName="list">
              <div styleName="list-item">
                <div styleName="avatar">
                  <Gravatar protocol="https://" email={owner.email} styleName="gravatar"/>
                </div>
                <div styleName="type">
                  <div styleName="name">{owner.firstName} {owner.lastName}</div>
                  <div styleName="email">{owner.email}</div>
                </div>
                <div styleName="role">
                  OWNER
                </div>
              </div>
              <FlipMove duration={500}
                        enterAnimation="fade"
                        leaveAnimation="fade"
                        maintainContainerHeight
                        easing="ease-out">
                {collaborations.map(collaboration => {
                  let user = collaboration.user;

                  let localDelete = isEditable;
                  let localRole = isEditable;

                  let blockName = null;
                  let style;

                  if (user) {
                    style = "list-item";
                    if (user.origin.id == self.origin.id) {
                      localDelete = true;
                      localRole = false;
                    }

                    if (user.firstName || user.lastName) {
                      blockName = (
                        <div styleName="type">
                          <div styleName="name">{user.firstName} {user.lastName} </div>
                          <div styleName="email">{user.email}</div>
                        </div>
                      );
                    } else {
                      blockName = (
                        <div styleName="type-one-str">
                          <div styleName="email">{collaboration.email}</div>
                        </div>
                      );
                    }

                  } else {
                    style = "list-item list-item-pending";

                    blockName = (
                      <div styleName="type-one-str">
                        <div styleName="email">{collaboration.email} (pending)</div>
                      </div>
                    );
                  }

                  return (
                    <div styleName={style} key={collaboration.email}>
                      <div styleName="avatar">
                        <Gravatar protocol="https://" email={collaboration.email} styleName="gravatar"/>
                      </div>
                      {blockName}
                      {
                        localRole ?
                          <div styleName="role editable" onClick={event => this.onRoleClick(event, collaboration)}>
                            {collaboration.role}
                          </div>
                        :
                          <div styleName="role">
                            {collaboration.role}
                          </div>
                      }
                      {
                        localDelete &&
                          <div styleName="hidden-controls">
                            <div styleName="hidden-remove" onClick={event => this.onDeleteClick(event, collaboration)}>
                              <InlineSVG styleName="cross"
                                         src={ImageCrossCircle}/>
                            </div>
                          </div>
                      }
                    </div>
                  );
                })}
                {isEditable &&
                  <div styleName="input-wrapper" key="input!">
                    <InputControl placeholder="Enter user's email"
                                  value={this.state.input}
                                  autoFocus={true}
                                  onChange={this.onInputChange}
                                  onKeyDown={this.onKeyDown}
                                  icon="users"
                                  onIconClick={this.onAddCollaboration}
                                  DOMRef={c => this.activeInput = c}/>


                    <div styleName="footer">
                      If the recipient doesn’t yet have a Chisel account, they will be sent an invitation to join.
                    </div>
                  </div>
                }
              </FlipMove>
            </div>
          </div>
        </ContainerComponent>
        {
          false && isEditable &&
            <div styleName="import">
              <div styleName="title">
                Import Contacts
              </div>

              <div styleName="description">
                If you would like to invite your contacts, select the service below.
              </div>

              <div styleName="contacts">
                <div styleName="contacts-item">
                  <div styleName="icon-wrapper">
                  </div>
                  Slack
                </div>
              </div>
            </div>
        }
      </div>
    );
  }
}
