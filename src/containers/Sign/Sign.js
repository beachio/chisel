import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';
import {Helmet} from "react-helmet";

import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import {login, register, restorePassword, resendVerEmail, resetStatus,
  ERROR_USER_EXISTS, ERROR_WRONG_PASS, ERROR_UNVERIF, ERROR_OTHER, OK} from 'ducks/user';
import {parseURLParams} from 'utils/common';

import styles from './Sign.sss';


const MODE_LOGIN        = 'login';
const MODE_REG          = 'register';
const MODE_REG_MAIL     = 'register_mail';
const MODE_UNVERIF      = 'unverified';
const MODE_FORGOT       = 'forgot';
const MODE_FORGOT_MAIL  = 'forgot_mail';
const MODE_SERVER_DOWN  = 'server_down';

@CSSModules(styles, {allowMultiple: true})
export class Sign extends Component  {
  state = {
    mode: MODE_LOGIN,

    email: '',
    password: '',
    passwordConfirm: '',

    error: null,
    lock: false
  };

  elmEmail;
  elmPassword;
  elmPasswordConfirm;


  constructor(props) {
    super(props);

    let urlParams = parseURLParams();
    if (urlParams.mode)
      this.state.mode = urlParams.mode;
    if (urlParams.email)
      this.state.email = urlParams.email;

    props.userActions.resetStatus();
  }

  componentWillReceiveProps(nextProps) {
    const {user, serverStatus} = nextProps;

    if (serverStatus.problemB) {
      this.setState({
        error: null,
        lock: false,
        mode: MODE_SERVER_DOWN
      });
      return;
    }

    const status = user.status;
    if (!status)
      return;

    let mode = this.state.mode;
    if (mode == MODE_REG && status == OK)
      mode = MODE_REG_MAIL;
    else if (mode == MODE_FORGOT && status == OK)
      mode = MODE_FORGOT_MAIL;
    else if (mode == MODE_LOGIN && status == ERROR_UNVERIF)
      mode = MODE_UNVERIF;

    this.props.userActions.resetStatus();
    this.setState({
      error: status,
      lock: !status,
      mode
    });
  }

  onEmailChange = event => {
    this.setState({
      email: event.target.value,
      error: null
    });
  };

  onPasswordChange = event => {
    this.setState({
      password: event.target.value,
      error: null
    });
  };

  onPasswordConfirmChange = event => {
    this.setState({
      passwordConfirm: event.target.value,
      error: null
    });
  };

  onLogin = event => {
    event.preventDefault();

    if (!this.getLoginAvail())
      return false;

    const {login} = this.props.userActions;
    login(this.state.email, this.state.password);
    this.setState({lock: true});

    return false;
  };

  onReg = event => {
    event.preventDefault();

    if (!this.getRegAvail())
      return false;

    const {register} = this.props.userActions;
    register(this.state.email, this.state.password);
    this.setState({lock: true});

    return false;
  };

  onRestore = event => {
    event.preventDefault();

    if (!this.getForgotAvail())
      return false;

    const {restorePassword} = this.props.userActions;
    restorePassword(this.state.email);
    this.setState({lock: true});

    return false;
  };

  onResend = () => {
    const {resendVerEmail} = this.props.userActions;
    resendVerEmail(this.state.email);
    this.setState({mode: MODE_REG_MAIL});
  };

  getLoginAvail() {
    return !this.state.lock &&
      this.state.email &&
      this.state.password;
  }

  getRegAvail() {
    return !this.state.lock &&
      this.state.email &&
      this.state.password &&
      this.state.password == this.state.passwordConfirm;
  }

  getForgotAvail() {
    return !this.state.lock &&
      this.state.email;
  }

  setMode(mode) {
    this.setState({
      mode,
      error: null,
      password: '',
      passwordConfirm: ''
    });
  }

  render() {
    this.elmEmail = <input styleName="input"
                           type="text"
                           autoFocus
                           value={this.state.email}
                           placeholder="Enter email"
                           onChange={this.onEmailChange} />;

    this.elmPassword = <input styleName="input"
                              type="password"
                              value={this.state.password}
                              placeholder="Enter password"
                              onChange={this.onPasswordChange} />;

    this.elmPasswordConfirm = <input styleName="input"
                                     type="password"
                                     value={this.state.passwordConfirm}
                                     placeholder="Confirm password"
                                     onChange={this.onPasswordConfirmChange} />;

    let content;

    switch (this.state.mode) {

      case MODE_LOGIN:
        content = (
          <form styleName="form" onSubmit={this.onLogin}>
            {this.elmEmail}
            {this.elmPassword}

            <div styleName="button">
              <ButtonControl color="green"
                             type="submit"
                             disabled={!this.getLoginAvail()}
                             value="Log in" />
            </div>

            <div styleName="errors">
              {
                this.state.error == ERROR_WRONG_PASS &&
                  <div styleName="error">Wrong email or password!</div>
              }
            </div>

            <div styleName="forgot" onClick={() => this.setMode(MODE_FORGOT)}>
              Forgot password?
            </div>
            <div styleName="forgot" onClick={() => this.setMode(MODE_REG)}>
              Registration
            </div>
          </form>
        );
        break;

      case MODE_REG:
        content = (
          <form styleName="form" onSubmit={this.onReg}>
            {this.elmEmail}
            {this.elmPassword}
            {this.elmPasswordConfirm}

            <div styleName="button">
              <ButtonControl color="green"
                             type="submit"
                             disabled={!this.getRegAvail()}
                             value="Register" />
            </div>

            <div styleName="errors">
              {
                this.state.error ==  ERROR_USER_EXISTS &&
                  <div styleName="error">This email is already in use!</div>
              }
            </div>

            <div styleName="forgot" onClick={() => this.setMode(MODE_LOGIN)}>
              Log in
            </div>
          </form>
        );
        break;

      case MODE_REG_MAIL:
        content = (
          <div styleName="form">
            <div styleName="description">
              We send to your email a link to confirm your registration. Please, open it.
            </div>

            <div styleName="forgot" onClick={() => this.setMode(MODE_LOGIN)}>
              Return to log in
            </div>
          </div>
        );
        break;

      case MODE_UNVERIF:
        content = (
          <div styleName="form">
            <div styleName="description">
              <p>It looks like your email is not verified yet.</p>
              <p>Please check your inbox for an email from us.</p>
            </div>

            <div styleName="forgot" onClick={this.onResend}>
              Resend verification email
            </div>

            <div styleName="forgot" onClick={() => this.setMode(MODE_LOGIN)}>
              Return to log in
            </div>
          </div>
        );
        break;

      case MODE_FORGOT:
        content = (
          <form styleName="form" onSubmit={this.onRestore}>
            <div styleName="description">
              Please, type your email, and we will send you a link to reset your password.
            </div>
            {this.elmEmail}
            <div styleName="button">
              <ButtonControl color="green"
                             type="submit"
                             disabled={!this.getForgotAvail()}
                             value="Restore password" />
            </div>

            <div styleName="errors">
              {this.state.error == ERROR_OTHER &&
                <div styleName="error">Wrong email!</div>
              }
            </div>

            <div styleName="forgot" onClick={() => this.setMode(MODE_LOGIN)}>
              Return to log in
            </div>
          </form>
        );
        break;

      case MODE_FORGOT_MAIL:
        content = (
          <div styleName="form">
            <div styleName="description">
              The mail have sended. Please, check your inbox.
            </div>

            <div styleName="forgot" onClick={() => this.setMode(MODE_LOGIN)}>
              Return to log in
            </div>
          </div>
        );
        break;

      case MODE_SERVER_DOWN:
        content = (
          <div styleName="form">
            <div styleName="description">
              We are sorry, but we have some problems with our service. Please, come back later.
            </div>

            <div styleName="forgot" onClick={() => this.setMode(MODE_LOGIN)}>
              Return to log in
            </div>
          </div>
        );
        break;
    }

    return (
      <div className='container'>
        <Helmet>
          <title>Sign in / Sign up - Chisel</title>
        </Helmet>
        <div styleName="Sign">
          <div styleName="logo">
            <img src={require("assets/images/chisel-logo.png")} />
          </div>
          <div styleName="title">Welcome to Chisel</div>
          {content}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user:         state.user,
    serverStatus: state.serverStatus
  };
}

function mapDispatchToProps(dispatch) {
  return {
    userActions: bindActionCreators({login, register, restorePassword, resendVerEmail, resetStatus}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Sign);
