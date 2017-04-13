import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import {Helmet} from "react-helmet";

import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import {currentServerURL} from 'utils/initialize';

import styles from './PasswordSet.sss';


@CSSModules(styles, {allowMultiple: true})
export default class PasswordSet extends Component  {
  state = {
    password: '',
    passwordConfirm: ''
  };
  
  urlParams = {};
  
  componentWillMount() {
    this.parseURLParams();
  }
  
  parseURLParams() {
    let pair; // Really a match. Index 0 is the full match; 1 & 2 are the key & val.
    let tokenize = /([^&=]+)=?([^&]*)/g;
    // decodeURIComponents escapes everything but will leave +s that should be ' '
    let reSpace = s => decodeURIComponent(s.replace(/\+/g, " "));
    // Substring to cut off the leading '?'
    let querystring = window.location.search.substring(1);
  
    while (pair = tokenize.exec(querystring))
      this.urlParams[reSpace(pair[1])] = reSpace(pair[2]);
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
    if (!this.isAvail()) {
      event.preventDefault();
      return false;
    }
    
    /*
    if (this.props.authorized)
      browserHistory.replace(`/${USERSPACE_URL}`);
    else
      browserHistory.replace(`/${SIGN_URL}`);
    */
    
    return false;
  };
  
  render() {
    let action = currentServerURL + '/apps/' + this.urlParams['id'] + '/request_password_reset';
    let username = this.urlParams['username'];
    let token = this.urlParams['token'];
    
    let error = this.urlParams['error'];
    
    return (
      <div className='container'>
        <Helmet>
          <title>Changing password - Chisel</title>
        </Helmet>
        
        <div styleName="PasswordSet">
          <div styleName="logo">
            <img src={require("assets/images/chisel-logo.png")} />
          </div>
          <div styleName="title">Please, type a new password for {username}:</div>
          
          <form styleName="form"
                action={action}
                method='POST'
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
            
            <input name='utf-8'
                   type='hidden'
                   value='✓' />
            <input name="username"
                   type="hidden"
                   value={username} />
            <input name="token"
                   type="hidden"
                   value={token} />
            
            <div styleName="button">
              <ButtonControl color="green"
                             type="submit"
                             disabled={!this.isAvail()}
                             value="Change password" />
            </div>
  
            <div styleName="errors">
              {
                error &&
                  <div styleName="error">{error}</div>
              }
            </div>
          </form>
          
        </div>
      </div>
    );
  }
}
