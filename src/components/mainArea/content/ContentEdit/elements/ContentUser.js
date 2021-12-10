import React from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';
import Gravatar from "react-gravatar";

import ContentBase from './ContentBase';
import {getUser} from 'utils/data';
import {checkEmail} from "utils/strings";

import InputControl from "components/elements/InputControl/InputControl";
import ButtonControl from "components/elements/ButtonControl/ButtonControl";

import styles from '../ContentEdit.sss';

import ImageCrossCircle from 'assets/images/cross-circle.svg';


@CSSModules(styles, {allowMultiple: true})
export default class ContentUser extends ContentBase {
  addingItem = null;
  validModels = null;


  constructor(props) {
    super(props);

    this.state.email = '';
  }

  getError () {
    const baseError = super.getError();
    if (baseError)
      return baseError;

    const {value, field} = this.state;

    if (!value || (field.isList && !value.length)) {
      if (field.isRequired)
        return 'This field is required!';
      return;
    }

    if (value) {
      if (field.isList) {
        for (let item of value) {
          //const exist = checkContentExistense(item);
          if (false)//!exist)
            return 'The referred content item is not exists!';
        }
      } else {
      }
    }

  }

  onClear = (event, user) => {
    event.stopPropagation();
    if (!this.props.isEditable)
      return;

    if (this.state.field.isList) {
      const users = this.state.value
        .filter(_user => _user != user);
      this.setValue(users, true);
    } else {
      this.setValue(undefined, true);
    }
  };

  onEmailChange = email => {
    this.setState({email});
  };

  onKeyDown = event => {
    if (this.props.alertShowing)
      return;

    //Enter pressed
    if (event.keyCode == 13) {
      this.onAddUser();
      //Esc pressed
    } else if (event.keyCode == 27) {
      this.setState({email: ""});
    }
  };

  onAddUser = async () => {
    if (!this.props.isEditable)
      return;

    let email = this.state.email;
    if (!email)
      return;

    if (!checkEmail(email)) {
      this.props.showAlert({
        title: "Error",
        description: "The email is not correct!",
        buttonText: "OK"
      });
      return;
    }

    try {
      const user = await getUser(email);
      if (this.state.field.isList) {
        let users = this.state.value;
        if (!users)
          users = [];
        this.setValue(users.concat(user), true);
      } else {
        this.setValue(user, true);
      }
      this.setState({email: ``});

    } catch(error) {
      this.props.showAlert({
        title: `Error`,
        description: `The user ${email} is not registered at Chisel!`,
        buttonText: "OK"
      });
    }
  };

  getInput() {
    let value = this.state.value;

    let oneBlock = user => {
      //let exist = checkContentExistense(item);
      //if (this.addingItem == item)
        let exist = true;
      let key = user.origin?.id ? user.origin.id : Math.random();

      if (exist) {
        let blockName;

        if (user.firstName || user.lastName) {
          blockName = (
            <div styleName="user-type">
              <div styleName="user-name">{user.firstName} {user.lastName} </div>
              <div styleName="user-email">{user.email}</div>
            </div>
          );
        } else {
          blockName = (
            <div styleName="user-type-one-str">
              <div styleName="user-email">{user.email}</div>
            </div>
          );
        }

        return (
          <div styleName="user-item" key={key}>
            <div styleName="user-avatar">
              <Gravatar protocol="https://" email={user.email} styleName="user-gravatar" />
            </div>
            {blockName}
            {this.props.isEditable &&
              <div styleName="user-remove" onClick={event => this.onClear(event, user)}>
                <InlineSVG styleName="user-cross"
                           src={ImageCrossCircle}/>
              </div>
            }
          </div>
        );

      } else {
        return (
          <div styleName="reference-item" key={key} onClick={e => this.onClear(e, user)}>
            <div styleName="reference-error">Error: the user doesn't exist. Click to reset.</div>
          </div>
        );
      }
    };

    let addBlock = (
      <div styleName="user-input-wrapper" key="input!">
        <InputControl type="big"
                      titled
                      placeholder="Enter user's email"
                      value={this.state.email}
                      onChange={this.onEmailChange}
                      onKeyDown={this.onKeyDown} />
        <ButtonControl value="Add"
                       minWidth={100}
                       disabled={!this.state.email || !this.props.isEditable}
                       onClick={this.onAddUser} />
      </div>
    );

    let inner = addBlock;

/*    value = [
      {
        username: 'pedik@govno.com'
      },
      {
        username: 'pedik@govno.com',
        firstName: "Hren",
        lastName: "Morzhov"
      },
      {
        username: 'pedik_dlinny_ochen_dlinny@govno.com'
      },
    ];*/

    if (this.state.field.isList) {
      if (value?.length)
        inner = (
          <div>
            {value.map(oneBlock)}
            {addBlock}
          </div>
        );

    } else {
      if (value)
        inner = oneBlock(value);
    }

    return (
      <div styleName="user">
        {inner}
      </div>
    );
  }

}
