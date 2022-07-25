import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Helmet} from "react-helmet-async";
import CSSModules from 'react-css-modules';

import InputControl from 'components/elements/InputControl/InputControl';
import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import ContainerComponent from 'components/elements/ContainerComponent/ContainerComponent';
import {update, updatePassword, ERROR_USER_EXISTS, ERROR_OTHER} from 'ducks/user';
import {URL_PAY_PLANS, URL_USERSPACE, URL_PAYMENT_METHODS} from "ducks/nav";
import {config, changeServerURL} from 'utils/initialize';
import {checkURL, checkEmail, getTextDate} from 'utils/strings';
import {checkPassword} from 'utils/data';

import styles from './UserProfile.sss';

const CHG_DATA      = `CHG_DATA`;
const CHG_EMAIL     = `CHG_EMAIL`;
const CHG_PASSWORD  = `CHG_PASSWORD`;
const CHG_SERVER    = `CHG_SERVER`;


@CSSModules(styles, {allowMultiple: true})
export class UserProfile extends Component  {
  userData = this.props.user.userData;

  state = {
    firstName: this.userData.firstName,
    lastName: this.userData.lastName,
    dirtyData: false,
    errorData: null,
    successData: ``,

    email: this.userData.email,
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

  lastChange = null;


  constructor(props) {
    super(props);
    this.state.serverURL = config.serverURL;
  }

  componentDidUpdate() {
    const {user} = this.props;

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
          this.setState({errorEmail});
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

    this.lastChange = null;
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

      this.userData.email = this.state.email;

      const {update} = this.props.userActions;
      update(this.userData);
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

  onChangeFirstName = firstName => {
    this.setState({firstName, dirtyData: true, errorData: null});
  };

  onChangeLastName = lastName => {
    this.setState({lastName, dirtyData: true, errorData: null});
  };

  onChangeEmail = email => {
    this.setState({
      email,
      dirtyEmail: email != this.userData.email,
      errorEmail: null
    });
  };

  onChangePasswordOld = passwordOld => {
    const dirtyPassword = !!passwordOld || !!this.state.password || !!this.state.passwordConfirm;
    this.setState({passwordOld, dirtyPassword, errorPassword: null});
  };

  onChangePassword = password => {
    const dirtyPassword = !!password || !!this.state.passwordOld || !!this.state.passwordConfirm;
    this.setState({password, dirtyPassword, errorPassword: null});
  };

  onChangePasswordConfirm = passwordConfirm => {
    const dirtyPassword = !!passwordConfirm || !!this.state.passwordOld || !!this.state.password;
    this.setState({passwordConfirm, dirtyPassword, errorPassword: null});
  };

  onChangeServerURL = serverURL => {
    this.setState({serverURL, dirtyServer: true, errorServer: null});
  };

  onChangePayPlan = () => {
    this.props.history.push(`/${URL_USERSPACE}/${URL_PAY_PLANS}`);
  };

  onChangePayMethods = () => {
    this.props.history.push(`/${URL_USERSPACE}/${URL_PAYMENT_METHODS}`);
  };

  render() {
    let dateSubEnd, cancelSub;
    const {stripeInitError} = this.props.pay;
    const showPay = !!this.userData.payPlan;
    const showPayChange = showPay && !stripeInitError;
    if (showPayChange) {
      const {subscription} = this.props.pay.stripeData;
      if (subscription) {
        dateSubEnd = getTextDate(new Date(subscription.current_period_end * 1000));
        cancelSub = subscription.cancel_at_period_end;
      }
    }

    return <>
      <Helmet>
        <title>User profile - Chisel</title>
      </Helmet>

      <ContainerComponent title="Profile">
        <div styleName="content">

          <form styleName="section" onSubmit={this.onSaveData}>
            <div styleName="section-header">Your Personal Data</div>
            <div styleName="name-wrapper">
              <div styleName="field">
                <div styleName="input-wrapper">
                  <InputControl type="big"
                                label="First Name"
                                value={this.state.firstName}
                                onChange={this.onChangeFirstName} />
                </div>
              </div>
              <div styleName="field">
                <div styleName="input-wrapper">
                  <InputControl type="big"
                                label="Last Name"
                                value={this.state.lastName}
                                onChange={this.onChangeLastName} />
              </div>
            </div>
            </div>
            <div styleName="buttons-wrapper">
              <div styleName="button">
                <ButtonControl color="purple"
                               type="submit"
                               titled
                               disabled={!this.state.dirtyData || this.state.errorData}
                               value="Update Personal Data"/>
              </div>
              {this.state.successData &&
                <div styleName="field-success">{this.state.successData}</div>
              }
              {this.state.errorData &&
                <div styleName="field-error">{this.state.errorData}</div>
              }
            </div>
          </form>

          <form styleName="section" onSubmit={this.onSaveEmail}>
            <div styleName="section-header">Your email</div>
            <div styleName="field">
              <div styleName="input-wrapper">
                <InputControl type="big"
                              label="Email"
                              value={this.state.email}
                              onChange={this.onChangeEmail} />
              </div>
            </div>
            <div styleName="buttons-wrapper">
              <div styleName="button">
                <ButtonControl color="purple"
                               type="submit"
                               disabled={!this.state.dirtyEmail || this.state.errorEmail}
                               value="Change Email"/>
              </div>
              {this.state.successEmail &&
                <div styleName="field-success">{this.state.successEmail}</div>
              }
              {this.state.errorEmail &&
                <div styleName="field-error">{this.state.errorEmail}</div>
              }
            </div>

          </form>

          <form styleName="section" onSubmit={this.onSavePassword}>
            <div styleName="section-header">Changing password</div>
            <div styleName="field">
              <div styleName="input-wrapper">
                <InputControl type="big"
                              label="Enter old password"
                              inputType="password"
                              value={this.state.passwordOld}
                              onChange={this.onChangePasswordOld} />
              </div>
            </div>
            <div styleName="field">
              <div styleName="input-wrapper">
                <InputControl type="big"
                              label="Enter new password"
                              inputType="password"
                              value={this.state.password}
                              onChange={this.onChangePassword} />
              </div>
            </div>
            <div styleName="field">
              <div styleName="input-wrapper">
                <InputControl type="big"
                              label="Confirm new password"
                              inputType="password"
                              value={this.state.passwordConfirm}
                              onChange={this.onChangePasswordConfirm} />
              </div>
            </div>
            <div styleName="buttons-wrapper">
              <div styleName="button">
                <ButtonControl color="purple"
                               type="submit"
                               disabled={!this.state.dirtyPassword || this.state.errorPassword}
                               value="Set New Password"/>
              </div>
              {this.state.successPassword &&
                <div styleName="field-success">{this.state.successPassword}</div>
              }
              {this.state.errorPassword &&
                <div styleName="field-error">{this.state.errorPassword}</div>
              }
            </div>

          </form>

          {showPay &&
            <div styleName="section">
              <div styleName="section-header">Pay plan</div>
              <div styleName="field">
                <div styleName="field-title">Your current pay plan:</div>
                <div styleName="field-value">{this.userData.payPlan.name}</div>
              </div>
              {!!dateSubEnd && (
                <div styleName="field">
                  {cancelSub ?
                    <div styleName="field-title">Your pay plan will change to <b>Free</b> at:</div>
                  :
                    <div styleName="field-title">Next payment:</div>
                  }
                  <div styleName="field-value">{dateSubEnd}</div>
                </div>)
              }
              {showPayChange && (
                <>
                  <div styleName="buttons-wrapper">
                    <ButtonControl color="purple"
                                   onClick={this.onChangePayPlan}
                                   value="Change Pay Plan"/>
                  </div>
                  <div styleName="buttons-wrapper">
                    <ButtonControl color="purple"
                                   onClick={this.onChangePayMethods}
                                   value="Change Pay Methods"/>
                  </div>
                </>)
              }
            </div>
          }

          <div styleName="section">
            <div styleName="section-header">Session</div>
            <div styleName="field">
              <div styleName="input-wrapper">
                <InputControl type="big"
                              label="User session token:"
                              readOnly={true}
                              value={this.userData.origin.id} />
              </div>
            </div>
          </div>

          <form styleName="section" onSubmit={this.onSaveServer}>
            <div styleName="section-header">Parse server data</div>
            <div styleName="field">
              <div styleName="input-wrapper">
                <InputControl type="big"
                              label="Server URL"
                              value={this.state.serverURL}
                              onChange={this.onChangeServerURL} />
              </div>
            </div>
            <div styleName="buttons-wrapper">
              <div styleName="button">
                <ButtonControl color="purple"
                               type="submit"
                               disabled={!this.state.dirtyServer || this.state.errorServer}
                               value="Update Server Data"/>
              </div>
              {this.state.successServer &&
                <div styleName="field-success">{this.state.successServer}</div>
              }
              {this.state.errorServer &&
                <div styleName="field-error">{this.state.errorServer}</div>
              }
            </div>

          </form>

        </div>
      </ContainerComponent>
    </>;
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
    userActions: bindActionCreators({update, updatePassword}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
