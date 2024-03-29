import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';
import {Helmet} from "react-helmet-async";
import InlineSVG from 'svg-inline-react';
import CheckboxControl from 'components/elements/CheckboxControl/CheckboxControl';

import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import {login, register, restorePassword, resendVerEmail, resetStatus,
  ERROR_USER_EXISTS, ERROR_WRONG_PASS, ERROR_UNVERIF, ERROR_OTHER, ERROR_WRONG_EMAIL_FORMAT, OK} from 'ducks/user';
import {parseURLParams} from 'utils/strings';

import styles from './Sign.sss';

import ImageLoginIllustration from "assets/images/chisel_login_illustration.png";
import ImageProductLogo from "assets/images/product-logo.svg";
import ImageProductLogoB from "assets/images/product-logo-b.svg";


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
  elmCheckbox;


  constructor(props) {
    super(props);

    let urlParams = parseURLParams();
    if (urlParams.mode)
      this.state.mode = urlParams.mode;
    if (urlParams.email)
      this.state.email = urlParams.email;

    props.userActions.resetStatus();
  }

  static getDerivedStateFromProps(props, state) {
    const {user, nav} = props;

    if (nav.serverProblemB) {
      return {
        error: null,
        lock: false,
        mode: MODE_SERVER_DOWN
      };
    }

    const status = user.status;
    if (!status)
      return null;

    let mode = state.mode;
    if (mode == MODE_REG && status == OK)
      mode = MODE_REG_MAIL;
    else if (mode == MODE_FORGOT && status == OK)
      mode = MODE_FORGOT_MAIL;
    else if (mode == MODE_LOGIN && status == ERROR_UNVERIF)
      mode = MODE_UNVERIF;

    return {
      error: status,
      lock: !status,
      mode
    };
  }

  componentDidUpdate() {
    if (this.props.user.status)
      this.props.userActions.resetStatus();
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
    this.elmEmail =
      <div styleName="input-wrapper">
        Email
        <input styleName="input"
               type="text"
               autoFocus
               value={this.state.email}
               onChange={this.onEmailChange} />
      </div>;

    this.elmPassword =
      <div styleName="input-wrapper">
        Password
        <input styleName="input"
               type="password"
               value={this.state.password}
               onChange={this.onPasswordChange} />
      </div>;

    this.elmPasswordConfirm =
      <div styleName="input-wrapper">
        Confirm Password
        <input styleName="input"
               type="password"
               value={this.state.passwordConfirm}
               onChange={this.onPasswordConfirmChange} />
      </div>;

    this.elmCheckbox =
      <div styleName="input-wrapper">
        <CheckboxControl title="Remember Me" />
      </div>;


    let content, bottomContent, title, icon;

    switch (this.state.mode) {

      case MODE_LOGIN:
        content = (
          <form styleName="form" onSubmit={this.onLogin}>
            {this.elmEmail}
            {this.elmPassword}
            <div styleName="checkbox-wrapper">
              {this.elmCheckbox}
              <div styleName="forgot" onClick={() => this.setMode(MODE_FORGOT)}>
                Forgot password?
              </div>
            </div>

            <div styleName="button">
              <ButtonControl color="purple"
                             type="submit"
                             disabled={!this.getLoginAvail()}
                             value="Log In" />
            </div>

            {this.state.error == ERROR_WRONG_PASS &&
              <div styleName="errors">
                <div styleName="error">Wrong email or password!</div>
              </div>
            }
          </form>
        );

        bottomContent = (
          <div styleName="bottom-content">
            No account? No problem!
            <div styleName="button-wrapper">
              <ButtonControl color="black"
                             type="submit"
                             value="Sign Up"
                             onClick={() => this.setMode(MODE_REG)}/>
            </div>
          </div>
        );

        title = (
          <div styleName="title">
              Welcome to Chisel <br />
              A simple powerful headless CMS
            </div>
        );

        icon = (
          <InlineSVG
            src={ImageProductLogo}
          />
        );

        break;

      case MODE_REG:
        let errorElm = null;
        switch (this.state.error) {
          case ERROR_USER_EXISTS:
            errorElm = <div styleName="error">This email is already in use!</div>;
            break;

          case ERROR_WRONG_EMAIL_FORMAT:
            errorElm = <div styleName="error">Wrong email format!</div>;
            break;

          case ERROR_OTHER:
            errorElm = <div styleName="error">There is something wrong. Try again later.</div>;
            break;
        }

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

            {!!errorElm &&
              <div styleName="errors">
                {errorElm}
              </div>
            }
          </form>
        );

        bottomContent = (
          <div styleName="bottom-content">
            <div styleName="reg-info">
              By clicking “Create Account”, you agree to our <br/>
              <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
            </div>
            <div styleName="reg-text">
              Already have an account?
            </div>
            <div styleName="button-wrapper">
              <ButtonControl color="black"
                             type="submit"
                             value="Log In"
                             onClick={() => this.setMode(MODE_LOGIN)}/>
            </div>
          </div>
        );

        title = (
          <div styleName="title">
            Create your new account <br/>
            and get started with Chisel today.
          </div>
        );

        icon = (
          <InlineSVG
            src={ImageProductLogoB}
          />
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
              Enter your email address and we will send you a a link to reset your password.
            </div>
            {this.elmEmail}
            <div styleName="button">
              <ButtonControl color="green"
                             type="submit"
                             disabled={!this.getForgotAvail()}
                             value="Restore Password" />
            </div>

            {this.state.error == ERROR_OTHER &&
              <div styleName="errors">
                <div styleName="error">Wrong email!</div>
              </div>
            }

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
      <div styleName="Sign">
        <Helmet>
          <title>Sign in / Sign up - Chisel</title>
        </Helmet>
        <div styleName="image">
          <img src={ImageLoginIllustration} />
        </div>
        <div styleName="content">
          <div styleName="inner">
            <div styleName="logo">
              {icon}
            </div>
            {title || 'Welcome'}
            {content}
          </div>
          {bottomContent}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    nav:  state.nav,
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    userActions: bindActionCreators({login, register, restorePassword, resendVerEmail, resetStatus}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Sign);
