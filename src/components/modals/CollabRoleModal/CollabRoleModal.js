import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import {ROLE_ADMIN, ROLE_DEVELOPER, ROLE_EDITOR} from "models/UserData";

import styles from './CollabRoleModal.sss';


const roles = [
  {
    role: ROLE_EDITOR,
    description: 'Editor can read/write content items and read site settings.'
  },
  {
    role: ROLE_DEVELOPER,
    description: 'Developer only can read content items, site settings and API docs.'
  },
  {
    role: ROLE_ADMIN,
    description: 'Admin has unlimited rights, include site removing.'
  }
];


@CSSModules(styles, {allowMultiple: true})
export class RoleControl extends Component {
  onClick = () => {
    this.props.onChange(this.props.role);
  };
  
  render() {
    const {role, checked} = this.props;

    let style = 'role-content';
    if (checked)
      style += ' checked';
    
    return (
      <div styleName="RoleControl"
           onClick={this.onClick}>
        <div styleName={style}>
          <div styleName="title">{role.role}</div>
          <div styleName="description">{role.description}</div>
        </div>
      </div>
    );
  }
}

@CSSModules(styles, {allowMultiple: true})
export default class CollabRoleModal extends Component {
  state = {
    role: this.props.params.role
  };
  
  active = false;
  focusElm = null;
  
  
  componentDidMount() {
    this.active = true;
    document.addEventListener('keydown', this.onKeyDown);
    
    if (this.focusElm)
      setTimeout(() => this.focusElm.focus(), 2);
  }
  
  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }
  
  onKeyDown = event => {
    if (!event)
      event = window.event;
    event.stopPropagation();
    
    //Enter or Esc pressed
    if (event.keyCode == 13)
      setTimeout(this.onConfirm, 1);
    else if (event.keyCode == 27)
      setTimeout(this.close, 1);
  };
  
  onChangeRole = ({role}) => {
    this.setState({role});
  };
  
  onConfirm = () => {
    if (!this.active)
      return;
    
    this.props.params.callback(this.state.role);
    this.close();
  };
  
  close = () => {
    this.active = false;
    this.props.onClose();
  };
  
  
  render() {
    return (
      <div styleName="modal" onClick={this.close}>
        <div styleName="modal-inner" onClick={e => e.stopPropagation()}>
          <div styleName="modal-header">
            <div styleName="title">Changing user's role</div>
          </div>
          <div styleName="content">
            
            <div>
              <div styleName="label">Choose role:</div>
              <div>
                {roles.map(role =>
                  <RoleControl role={role}
                               key={role.role}
                               checked={this.state.role == role.role}
                               onChange={this.onChangeRole} />)
                }
              </div>
            </div>
            
            <div styleName="buttons-wrapper">
              <div styleName="buttons-inner">
                <ButtonControl color="green"
                               value="OK"
                               onClick={this.onConfirm} />
              </div>
              <div styleName="buttons-inner">
                <ButtonControl color="gray"
                               value="Cancel"
                               onClick={this.close} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
