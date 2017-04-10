import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Helmet} from "react-helmet";
import CSSModules from 'react-css-modules';

import InputControl from 'components/elements/InputControl/InputControl';
import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import ContainerComponent from 'components/elements/ContainerComponent/ContainerComponent';
import {update, updatePassword} from 'ducks/user';
import {currentServerURL, changeServerURL} from 'utils/initialize';
import {checkURL} from 'utils/common';

import styles from './UserProfile.sss';


@CSSModules(styles, {allowMultiple: true})
export class UserProfile extends Component  {
  state = {
    firstName: '',
    lastName: '',
    dirtyData: false,
    errorData: null,
    
    email: '',
    dirtyEmail: false,
    errorEmail: null,
    
    password: '',
    passwordConfirm: '',
    dirtyPassword: false,
    errorPassword: null,
    
    serverURL: '',
    dirtyServer: false,
    errorServer: null
  };
  userData = null;
  
  
  componentWillMount() {
    const {user} = this.props;
    
    this.userData = user.userData;
    this.setState({
      firstName: user.userData.firstName,
      lastName: user.userData.lastName,
      
      email: user.email,
      
      serverURL: currentServerURL
    });
  }
  
  onSaveData = e => {
    e.preventDefault();
    
    if (this.validateData()) {
      this.setState({dirtyData: false});
      
      this.userData.firstName = this.state.firstName;
      this.userData.lastName = this.state.lastName;
      
      const {update} = this.props.userActions;
      update(this.userData);
    }
  };
  
  onSaveEmail = e => {
    e.preventDefault();
    
    if (this.validateEmail()) {
      this.setState({dirtyEmail: false});
      
      this.userData.email = this.state.email;
      
      const {update} = this.props.userActions;
      update(this.userData);
    }
  };
  
  onSavePassword = e => {
    e.preventDefault();
    
    if (this.validatePassword()) {
      const {updatePassword} = this.props.userActions;
      updatePassword(this.state.password);
  
      this.setState({password: '', passwordConfirm: '', dirtyPassword: false});
    }
  };
  
  onSaveServer = e => {
    e.preventDefault();
    
    if (this.validateServer()) {
      this.setState({dirtyServer: false});
      
      changeServerURL(this.state.serverURL);
    }
  };
  
  validateData() {
    return true;
  }
  
  validateEmail() {
    return true;
  }
  
  validatePassword() {
    if (this.state.password != this.state.passwordConfirm) {
      this.setState({errorPassword: `Passwords don't match!`});
      return false;
    }
    
    return true;
  }
  
  validateServer() {
    if (!checkURL(this.state.serverURL)) {
      this.setState({errorServer: `Invalid URL!`});
      return false;
    }
    
    return true;
  }
  
  onChangeFirstName = event => {
    let firstName = event.target.value;
    this.setState({firstName, dirtyData: true, errorData: null});
  };
  
  onChangeLastName = event => {
    let lastName = event.target.value;
    this.setState({lastName, dirtyData: true, errorData: null});
  };
  
  onChangeEmail = event => {
    let email = event.target.value;
    this.setState({email, dirtyEmail: true, errorEmail: null});
  };
  
  onChangePassword = event => {
    let password = event.target.value;
    let dirtyPassword = !!password || !!this.state.passwordConfirm;
    this.setState({password, dirtyPassword, errorPassword: null});
  };
  
  onChangePasswordConfirm = event => {
    let passwordConfirm = event.target.value;
    let dirtyPassword = !!passwordConfirm || !!this.state.password;
    this.setState({passwordConfirm, dirtyPassword, errorPassword: null});
  };
  
  onChangeServerURL = event => {
    let serverURL = event.target.value;
    this.setState({serverURL, dirtyServer: true, errorServer: null});
  };
  
  render() {
    return (
      <div className="mainArea">
        <Helmet>
          <title>User profile - Chisel</title>
        </Helmet>
        
        <ContainerComponent title="User profile">
          <div styleName="content">
            
            <form styleName="section" onSubmit={this.onSaveData}>
              <div styleName="section-header">Your personal data</div>
              <div styleName="field">
                <div styleName="field-title">First name</div>
                <div styleName="input-wrapper">
                  <InputControl type="big"
                                value={this.state.firstName}
                                onChange={this.onChangeFirstName} />
                </div>
              </div>
              <div styleName="field">
                <div styleName="field-title">Last name</div>
                <div styleName="input-wrapper">
                  <InputControl type="big"
                                value={this.state.lastName}
                                onChange={this.onChangeLastName} />
                </div>
              </div>
              <div styleName="buttons-wrapper">
                <ButtonControl color="green"
                               type="submit"
                               disabled={!this.state.dirtyData || this.state.errorData}
                               value="Update personal data"/>
              </div>
              {
                this.state.errorData &&
                  <div styleName="field-error">
                    {this.state.errorData}
                  </div>
              }
            </form>
  
            <form styleName="section" onSubmit={this.onSaveEmail}>
              <div styleName="section-header">Your email</div>
              <div styleName="field">
                <div styleName="field-title">Email</div>
                <div styleName="input-wrapper">
                  <InputControl type="big"
                                value={this.state.email}
                                onChange={this.onChangeEmail} />
                </div>
              </div>
              <div styleName="buttons-wrapper">
                <ButtonControl color="green"
                               type="submit"
                               disabled={!this.state.dirtyEmail || this.state.errorEmail}
                               value="Change email"/>
              </div>
              {
                this.state.errorEmail &&
                  <div styleName="field-error">
                    {this.state.errorEmail}
                  </div>
              }
            </form>
  
            <form styleName="section" onSubmit={this.onSavePassword}>
              <div styleName="section-header">Changing password</div>
              <div styleName="field">
                <div styleName="field-title">Enter new password</div>
                <div styleName="input-wrapper">
                  <InputControl type="big"
                                inputType="password"
                                value={this.state.password}
                                onChange={this.onChangePassword} />
                </div>
              </div>
              <div styleName="field">
                <div styleName="field-title">Confirm new password</div>
                <div styleName="input-wrapper">
                  <InputControl type="big"
                                inputType="password"
                                value={this.state.passwordConfirm}
                                onChange={this.onChangePasswordConfirm} />
                </div>
              </div>
              <div styleName="buttons-wrapper">
                <ButtonControl color="green"
                               type="submit"
                               disabled={!this.state.dirtyPassword || this.state.errorPassword}
                               value="Set new password"/>
              </div>
              {
                this.state.errorPassword &&
                  <div styleName="field-error">
                    {this.state.errorPassword}
                  </div>
              }
            </form>
  
            <form styleName="section" onSubmit={this.onSaveServer}>
              <div styleName="section-header">Parse server data</div>
              <div styleName="field">
                <div styleName="field-title">Server URL</div>
                <div styleName="input-wrapper">
                  <InputControl type="big"
                                value={this.state.serverURL}
                                onChange={this.onChangeServerURL} />
                </div>
              </div>
              <div styleName="buttons-wrapper">
                <ButtonControl color="green"
                               type="submit"
                               disabled={!this.state.dirtyServer || this.state.errorServer}
                               value="Update server data"/>
              </div>
              {
                this.state.errorServer &&
                  <div styleName="field-error">
                    {this.state.errorServer}
                  </div>
              }
            </form>
            
          </div>
        </ContainerComponent>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user:   state.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    userActions: bindActionCreators({update, updatePassword}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
