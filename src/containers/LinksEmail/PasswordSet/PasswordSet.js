import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Helmet} from "react-helmet";

import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import {config} from 'utils/initialize';
import {login} from 'ducks/user';
import {parseURLParams, URLEncode} from 'utils/common';

import styles from './PasswordSet.sss';


const MODE_SETUP  = 'MODE_SETUP';
const MODE_DONE   = 'MODE_DONE';

@CSSModules(styles, {allowMultiple: true})
export class PasswordSet extends Component  {
  state = {
    mode: MODE_SETUP,
    
    password: '',
    passwordConfirm: '',
    
    error: null
  };
  
  urlParams = {};
  lock = false;
  
  
  constructor(props) {
    super(props);

    this.urlParams = parseURLParams();
    this.state.error = this.urlParams.error;
  }
  
  isAvail() {
    return this.state.password &&
      this.state.password == this.state.passwordConfirm;
  }
  
  onPasswordChange = event => {
    this.setState({password: event.target.value});
  };
  
  onPasswordConfirmChange = event => {
    this.setState({passwordConfirm: event.target.value});
  };
  
  onChange = event => {
    event.preventDefault();
    
    if (!this.isAvail())
      return false;
    
    let params = {
      username: this.urlParams.username,
      token: this.urlParams.token,
      'utf-8': '✓',
      'new_password': this.state.password
    };
    
    fetch(config.serverURL + '/apps/' + this.urlParams['id'] + '/request_password_reset', {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: URLEncode(params)
    })
      .then(response => {
        this.setState({mode: MODE_DONE});
      })
      .catch(error => {
        this.setState({error});
      });
    
    return false;
  };
  
  onLogin = event => {
    event.preventDefault();
    
    if (this.lock)
      return;
    this.lock = true;
  
    const {login} = this.props.userActions;
    login(this.urlParams.username, this.state.password);
  };
  
  render() {
    let content, title;
    switch (this.state.mode) {
      case MODE_SETUP:
        title = `Please, type a new password for ${this.urlParams.username}:`;
        content = (
          <form styleName="form"
                onSubmit={this.onChange}>
    
            <input styleName="input"
                   name="new_password"
                   type="password"
                   value={this.state.password}
                   placeholder="Enter password"
                   onChange={this.onPasswordChange} />
    
            <input styleName="input"
                   type="password"
                   value={this.state.passwordConfirm}
                   placeholder="Confirm password"
                   onChange={this.onPasswordConfirmChange} />
    
            <div styleName="button">
              <ButtonControl color="green"
                             type="submit"
                             disabled={!this.isAvail()}
                             value="Change Password" />
            </div>
    
            <div styleName="errors">
              {
                this.state.error &&
                  <div styleName="error">{this.state.error}</div>
              }
            </div>
          </form>
        );
        break;
        
      case MODE_DONE:
        title = `Your password was changed successfully.`;
        content = (
          <form styleName="form" onSubmit={this.onLogin}>
            <div styleName="button">
              <ButtonControl color="green"
                             type="submit"
                             value="Log In" />
            </div>
          </form>
        );
        break;
    }
    
    
    return (
      <div styleName="PasswordSet">
        <Helmet>
          <title>Changing password - Chisel</title>
        </Helmet>
        <div styleName="logo">
          <img src={require("assets/images/chisel-logo.png")} />
        </div>
        <div styleName="title">{title}</div>
        {content}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    authorized: state.user.authorized
  };
}

function mapDispatchToProps(dispatch) {
  return {
    userActions: bindActionCreators({login}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PasswordSet);
