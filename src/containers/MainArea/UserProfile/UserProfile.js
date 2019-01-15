import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Helmet} from "react-helmet";
import {browserHistory} from "react-router";
import CSSModules from 'react-css-modules';

import InputControl from 'components/elements/InputControl/InputControl';
import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import ContainerComponent from 'components/elements/ContainerComponent/ContainerComponent';
import {update, updateEmail, updatePassword, resendVerEmail, ERROR_USER_EXISTS, ERROR_OTHER} from 'ducks/user';
import {URL_PAY_PLANS, URL_USERSPACE, URL_PAYMENT_METHODS} from "ducks/nav";
import {config, changeServerURL} from 'utils/initialize';
import {checkURL, checkEmail, getTextDate} from 'utils/common';
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
    emailNew: '',
    dirtyEmail: false,
    errorEmail: null,
    successEmailState: false,
    
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
    
    this.state.firstName = this.userData.firstName;
    this.state.lastName = this.userData.lastName;
    this.state.email = this.userData.email;
    
    if (this.userData.emailNew) {
      this.state.emailNew = this.userData.emailNew;
      this.state.successEmailState = true;
    } else {
      this.state.emailNew = this.userData.email;
    }
    
    this.state.serverURL = config.serverURL;
  }
  
  componentWillReceiveProps(nextProps) {
    const {user} = nextProps;
    
    switch (this.lastChange) {
      case CHG_DATA:
        this.setState({successData: `Data was successfully changed!`});
        setTimeout(() => this.setState({successData: ``}), 2500);
        break;
        
      case CHG_EMAIL:
        let errorEmail = null;
        switch (user.error) {
          case ERROR_USER_EXISTS: errorEmail = 'The user with this email also exists!'; break;
          case ERROR_OTHER:       errorEmail = 'Unknown error!';                        break;
        }
        
        if (errorEmail) {
          this.setState({
            emailNew: this.userData.emailNew ? this.userData.emailNew : this.userData.email,
            errorEmail
          });
        } else {
          this.setState({successEmailState: true});
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
      updateEmail(this.state.emailNew);
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
    if (!checkEmail(this.state.emailNew)) {
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
      .catch(e => {
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
    let emailNew = event.target.value;
    this.setState({
      emailNew,
      dirtyEmail: emailNew != this.userData.emailNew,
      errorEmail: null
    });
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
  
  resendVerification = e => {
    const {resendVerEmail} = this.props.userActions;
    resendVerEmail();
  };
  
  onChangePayPlan = () => {
    browserHistory.push(`/${URL_USERSPACE}/${URL_PAY_PLANS}`);
  };
  
  onChangePayMethods = () => {
    browserHistory.push(`/${URL_USERSPACE}/${URL_PAYMENT_METHODS}`);
  };
  
  render() {
    let dateSubEnd, cancelSub;
    const {subscription} = this.props.pay.stripeData;
    if (subscription) {
      dateSubEnd = getTextDate(new Date(subscription.current_period_end * 1000));
      cancelSub = subscription.cancel_at_period_end;
    }
    
    return [
        <Helmet key="helmet">
          <title>User profile - Chisel</title>
        </Helmet>,
      
        <ContainerComponent key="content" title="Profile">
          <div styleName="content">

            <form styleName="section" onSubmit={this.onSaveData}>
              <div styleName="section-header">Your Personal Data</div>
              <div styleName="name-wrapper">
                <div styleName="field">
                  <div styleName="field-title">First Name</div>
                  <div styleName="input-wrapper">
                    <InputControl type="big"
                                  titled
                                  value={this.state.firstName}
                                  onChange={this.onChangeFirstName} />
                  </div>
                </div>
                <div styleName="field">
                  <div styleName="field-title">Last Name</div>
                  <div styleName="input-wrapper">
                    <InputControl type="big"
                                  titled
                                  value={this.state.lastName}
                                  onChange={this.onChangeLastName} />
                </div>
              </div>
              </div>
              <div styleName="buttons-wrapper">
                <ButtonControl color="purple"
                               type="submit"
                               titled
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
                                value={this.state.emailNew}
                                titled
                                onChange={this.onChangeEmail} />
                </div>
              </div>
              <div styleName="buttons-wrapper">
                <ButtonControl color="purple"
                               type="submit"
                               disabled={!this.state.dirtyEmail || this.state.errorEmail}
                               value="Change email"/>
              </div>
                {this.state.successEmailState &&
                  <div styleName="field-success">
                    <div>
                      Your email was changed. We've sent to your new email a link to confirm it. You can use your old email <b>{this.state.email}</b> before confirmation.
                    </div>
                    <div styleName="field-success-resend" onClick={this.resendVerification}>
                      Resend confirmation email
                    </div>
                  </div>
                }
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
                                titled
                                value={this.state.passwordOld}
                                onChange={this.onChangePasswordOld} />
                </div>
              </div>
              <div styleName="field">
                <div styleName="field-title">Enter new password</div>
                <div styleName="input-wrapper">
                  <InputControl type="big"
                                inputType="password"
                                titled
                                value={this.state.password}
                                onChange={this.onChangePassword} />
                </div>
              </div>
              <div styleName="field">
                <div styleName="field-title">Confirm new password</div>
                <div styleName="input-wrapper">
                  <InputControl type="big"
                                inputType="password"
                                titled
                                value={this.state.passwordConfirm}
                                onChange={this.onChangePasswordConfirm} />
                </div>
              </div>
              <div styleName="buttons-wrapper">
                <ButtonControl color="purple"
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
            
            <div styleName="section">
              <div styleName="section-header">Pay plan</div>
              <div styleName="field">
                <div styleName="field-title">Your current pay plan:</div>
                <div styleName="field-value">{this.userData.payPlan.name}</div>
              </div>
              {!!subscription && (
                <div styleName="field">
                  {cancelSub ?
                    <div styleName="field-title">Your pay plan will change to <b>Free</b> at:</div>
                  :
                    <div styleName="field-title">Next payment:</div>
                  }
                  <div styleName="field-value">{dateSubEnd}</div>
                </div>)
              }
              <div styleName="buttons-wrapper">
                <ButtonControl color="purple"
                               onClick={this.onChangePayPlan}
                               value="Change pay plan"/>
              </div>
              <div styleName="buttons-wrapper">
                <ButtonControl color="purple"
                               onClick={this.onChangePayMethods}
                               value="Change pay methods"/>
              </div>
            </div>

            <div styleName="section">
              <div styleName="section-header">Session</div>
              <div styleName="field">
                <div styleName="field-title">User session token:</div>
                <div styleName="field-value">{this.userData.origin.id}</div>
              </div>
            </div>
  
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
                <ButtonControl color="purple"
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
    ];
  }
}


function mapStateToProps(state) {
  return {
    user: state.user,
    pay: state.pay
  };
}

function mapDispatchToProps(dispatch) {
  return {
    userActions: bindActionCreators({update, updateEmail, updatePassword, resendVerEmail}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
