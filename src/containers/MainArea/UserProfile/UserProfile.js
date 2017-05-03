import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Helmet} from "react-helmet";
import CSSModules from 'react-css-modules';

import InputControl from 'components/elements/InputControl/InputControl';
import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import ContainerComponent from 'components/elements/ContainerComponent/ContainerComponent';
import {update, updateEmail, updatePassword, ERROR_USER_EXISTS, ERROR_OTHER} from 'ducks/user';
import {currentServerURL, changeServerURL} from 'utils/initialize';
import {checkURL, checkEmail} from 'utils/common';
import {checkPassword} from 'utils/data';

import styles from './UserProfile.sss';

const CHG_DATA      = `CHG_DATA`;
const CHG_EMAIL     = `CHG_EMAIL`;
const CHG_PASSWORD  = `CHG_PASSWORD`;
const CHG_SERVER    = `CHG_SERVER`;


@CSSModules(styles, {allowMultiple: true})
export class UserProfile extends Component  {
  state = {
    firstName: '',
    lastName: '',
    dirtyData: false,
    errorData: null,
    successData: ``,
    
    email: '',
    dirtyEmail: false,
    errorEmail: null,
    successEmail: ``,
    
    passwordOld: ``,
    password: '',
    passwordConfirm: '',
    dirtyPassword: false,
    errorPassword: null,
    successPassword: ``,
    
    serverURL: '',
    dirtyServer: false,
    errorServer: null,
    successServer: ``
  };
  userData = null;
  lastChange = null;
  
  
  constructor(props) {
    super(props);
    
    const {user} = props;
    
    this.userData = user.userData;
    
    this.state.firstName = user.userData.firstName;
    this.state.lastName = user.userData.lastName;
    this.state.email = user.email;
    this.state.serverURL = currentServerURL;
  }
  
  componentWillReceiveProps(nextProps) {
    const {user} = nextProps;
    
    switch (this.lastChange) {
      case CHG_DATA:
        this.setState({successData: `Data was successfully changed!`});
        setTimeout(() => this.setState({successData: ``}), 2500);
        break;
        
      case CHG_EMAIL:
        if (user.updateError == ERROR_USER_EXISTS) {
          this.setState({
            email: this.userData.email,
            errorEmail: 'The user with this email also exists!'
          });
        } else if (user.updateError == ERROR_OTHER) {
          this.setState({
            email: this.userData.email,
            errorEmail: 'Unknown error!'
          });
        } else {
          this.setState({successEmail: `Email was successfully changed!`});
          setTimeout(() => this.setState({successEmail: ``}), 2500);
        }
        break;
        
      case CHG_PASSWORD:
        this.setState({successPassword: `Password was successfully changed!`});
        setTimeout(() => this.setState({successPassword: ``}), 2500);
        break;
    }
  }
  
  onSaveData = e => {
    e.preventDefault();
    
    if (!this.state.dirtyData || this.state.errorData)
      return;
    
    if (this.validateData()) {
      this.setState({dirtyData: false});
      this.lastChange = CHG_DATA;
      
      this.userData.firstName = this.state.firstName;
      this.userData.lastName = this.state.lastName;
      
      const {update} = this.props.userActions;
      update(this.userData);
    }
  };
  
  onSaveEmail = e => {
    e.preventDefault();
    
    if (!this.state.dirtyEmail || this.state.errorEmail)
      return;
    
    if (this.validateEmail()) {
      this.setState({dirtyEmail: false});
      this.lastChange = CHG_EMAIL;
      
      const {updateEmail} = this.props.userActions;
      updateEmail(this.state.email);
    }
  };
  
  onSavePassword = e => {
    e.preventDefault();
    
    if (!this.state.dirtyPassword || this.state.errorPassword)
      return;
    
    this.validatePassword()
      .then(() => {
        const {updatePassword} = this.props.userActions;
        updatePassword(this.state.password);
        this.lastChange = CHG_PASSWORD;
    
        this.setState({passwordOld: ``, password: '', passwordConfirm: '', dirtyPassword: false});
      })
      .catch(() => {});
  };
  
  onSaveServer = e => {
    e.preventDefault();
    
    if (!this.state.dirtyServer || this.state.errorServer)
      return;
    
    if (this.validateServer()) {
      this.setState({dirtyServer: false});
      this.lastChange = CHG_SERVER;
      
      changeServerURL(this.state.serverURL);
      
      this.setState({successServer: `Server was successfully changed!`});
      setTimeout(() => this.setState({successServer: ``}), 2500);
    }
  };
  
  validateData() {
    return true;
  }
  
  validateEmail() {
    if (!checkEmail(this.state.email)) {
      this.setState({errorEmail: `Invalid email!`});
      return false;
    }
  
    return true;
  }
  
  validatePassword() {
    if (this.state.password != this.state.passwordConfirm) {
      this.setState({errorPassword: `Passwords don't match!`});
      return Promise.reject();
    }
    
    return checkPassword(this.state.passwordOld)
      .catch((e) => {
        this.setState({errorPassword: `Wrong old password!`});
        return Promise.reject();
      });
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
    this.setState({email, dirtyEmail: email != this.userData.email, errorEmail: null});
  };
  
  onChangePasswordOld = event => {
    let passwordOld = event.target.value;
    let dirtyPassword = !!passwordOld || !!this.state.password || !!this.state.passwordConfirm;
    this.setState({passwordOld, dirtyPassword, errorPassword: null});
  };
  
  onChangePassword = event => {
    let password = event.target.value;
    let dirtyPassword = !!password || !!this.state.passwordOld || !!this.state.passwordConfirm;
    this.setState({password, dirtyPassword, errorPassword: null});
  };
  
  onChangePasswordConfirm = event => {
    let passwordConfirm = event.target.value;
    let dirtyPassword = !!passwordConfirm || !!this.state.passwordOld || !!this.state.password;
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
              <div styleName="field-success">
                {this.state.successData}
              </div>
              <div styleName="field-error">
                {this.state.errorData}
              </div>
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
              <div styleName="field-success">
                {this.state.successEmail}
              </div>
              <div styleName="field-error">
                {this.state.errorEmail}
              </div>
            </form>
  
            <form styleName="section" onSubmit={this.onSavePassword}>
              <div styleName="section-header">Changing password</div>
              <div styleName="field">
                <div styleName="field-title">Enter old password</div>
                <div styleName="input-wrapper">
                  <InputControl type="big"
                                inputType="password"
                                value={this.state.passwordOld}
                                onChange={this.onChangePasswordOld} />
                </div>
              </div>
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
              <div styleName="field-success">
                {this.state.successPassword}
              </div>
              <div styleName="field-error">
                {this.state.errorPassword}
              </div>
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
              <div styleName="field-success">
                {this.state.successServer}
              </div>
              <div styleName="field-error">
                {this.state.errorServer}
              </div>
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
    userActions: bindActionCreators({update, updateEmail, updatePassword}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
