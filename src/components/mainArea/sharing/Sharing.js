import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';
import Gravatar from 'react-gravatar';
import {Parse} from 'parse';
import FlipMove from 'react-flip-move';

import {ROLE_ADMIN, ROLE_EDITOR, ROLE_DEVELOPER} from 'models/UserData';
import {getUser, checkCollaboration, COLLAB_CORRECT, COLLAB_ERROR_EXIST, COLLAB_ERROR_SELF} from 'utils/data';
import ContainerComponent from 'components/elements/ContainerComponent/ContainerComponent';
import InputControl from 'components/elements/InputControl/InputControl';
import {ALERT_TYPE_CONFIRM} from 'components/modals/AlertModal/AlertModal';

import styles from './Sharing.sss';


@CSSModules(styles, {allowMultiple: true})
export default class Sharing extends Component {
  state = {
    collaborations: [],
    input: ""
  };
  
  activeInput = null;
  returnFocus = false;


  constructor(props) {
    super(props);
    
    this.state.collaborations = props.collaborations;
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.alertShowing && this.activeInput && this.returnFocus) {
      this.returnFocus = false;
      setTimeout(() => this.activeInput.focus(), 1);
    }
    this.setState({collaborations: nextProps.collaborations});
    if (nextProps.collaborations != this.state.collaborations)
      this.setState({input: ""});
  }

  onInputChange = event => {
    const input = event.target.value;
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
              description: "This user is also exist",
              buttonText: "OK"
            });
            this.returnFocus = true;
            break;
        }
      })
      .catch(error => {
        console.error(error);
  
        this.props.showAlert({
          type: ALERT_TYPE_CONFIRM,
          title: `Not registered user`,
          description: `The user ${email} is not registered at Chisel. Would you like to send an invitation to them?`,
          onConfirm: () => this.props.addInviteCollaboration(email)
        });
        this.returnFocus = true;
        this.setState({input: ``});
      });
  };
  
  onRoleClick(e, index) {
    e.stopPropagation();
    
    let collaborations = this.state.collaborations;
    let collab = collaborations[index];
    if (collab.role == ROLE_ADMIN)
      collab.role = ROLE_EDITOR;
    else if (collab.role == ROLE_EDITOR)
      collab.role = ROLE_DEVELOPER;
    else if (collab.role == ROLE_DEVELOPER)
      collab.role = ROLE_ADMIN;
    
    this.setState({collaborations});
    this.props.updateCollaboration(collab);
  }
  
  onDeleteClick(event, collab) {
    event.stopPropagation();
  
    let description = "This action cannot be undone. Are you sure?";
    let delFunc = this.props.deleteCollaboration;
    let confirmString = '';
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
    const {owner, isEditable} = this.props;
    const self = this.props.user;

    return (
      <div styleName="wrapper">
        <ContainerComponent title="Collaborators">
          <div styleName="sharing-wrapper">
            <div styleName="list">
              <div styleName="list-item">
                <div styleName="avatar">
                  <Gravatar email={owner.email} styleName="gravatar"/>
                </div>
                <div styleName="type">
                  <div styleName="name">{owner.firstName} {owner.lastName}</div>
                  <div styleName="email">{owner.username}</div>
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
                {this.state.collaborations.map((collaboration, index) => {
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
                          <div styleName="email">{user.username}</div>
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
                        <Gravatar email={collaboration.email} styleName="gravatar"/>
                      </div>
                      {blockName}
                      {
                        localRole ?
                          <div styleName="role editable" onClick={event => this.onRoleClick(event, index)}>
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
                                         src={require("assets/images/cross.svg")}/>
                            </div>
                          </div>
                      }
                    </div>
                  );
                })}
                {isEditable &&
                  <div styleName="input-wrapper">
                    <InputControl placeholder="Enter one or more emails"
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
        }
      </div>
    );
  }
}
