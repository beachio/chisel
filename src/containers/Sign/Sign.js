import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';
import {Helmet} from "react-helmet";

import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import {loginOrRegister, restorePassword, ERROR_WRONG_PASS} from 'ducks/user';

import styles from './Sign.sss';


const MODE_SIGN           = 'MODE_SIGN';
const MODE_FORGOT         = 'MODE_FORGOT';
const MODE_FORGOT_SENDED  = 'MODE_FORGOT_SENDED';

@CSSModules(styles, {allowMultiple: true})
export class Sign extends Component  {
  state = {
    mode: MODE_SIGN,
    
    email: '',
    password: '',
    emptyFields: false,
    authError: null
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      authError: nextProps.authError
    });
  }

  onEmailChange = event => {
    this.setState({
      email: event.target.value,
      emptyFields: false,
      authError: null
    });
  };

  onPasswordChange = event => {
    this.setState({
      password: event.target.value,
      emptyFields: false,
      authError: null
    });
  };

  onSubmit = event => {
    event.preventDefault();
    
    const {loginOrRegister} = this.props.userActions;
    if (this.state.email.length && this.state.password.length)
      loginOrRegister(this.state.email, this.state.password);
    else
      this.setState({emptyFields: true});
    
    return false;
  };
  
  onForgot = () => {
    this.setState({mode: MODE_FORGOT, emptyFields: false, authError: null});
  };
  
  onReturnSign = () => {
    this.setState({mode: MODE_SIGN, emptyFields: false, authError: null});
  };
  
  onRestore = event => {
    event.preventDefault();
    
    if (!this.state.email) {
      this.setState({emptyFields: true});
      return false;
    }
    
    const {restorePassword} = this.props.userActions;
    restorePassword(this.state.email);
    this.setState({mode: MODE_FORGOT_SENDED});
    return false;
  };

  render() {
    let content = (
      <form styleName="form" onSubmit={this.onSubmit}>
        <input styleName="input"
               type="text"
               value={this.state.email}
               placeholder="Enter email"
               onChange={this.onEmailChange} />
        <input styleName="input"
               type="password"
               value={this.state.password}
               placeholder="Enter password"
               onChange={this.onPasswordChange} />
        <div styleName="button">
          <ButtonControl color="green"
                         type="submit"
                         value="Sign in / Sign up" />
        </div>
  
        <div styleName="errors">
          {
            this.state.authError ==  ERROR_WRONG_PASS &&
              <div styleName="error">Wrong email or password!</div>
          }
          {
            this.state.emptyFields &&
              <div styleName="error">You must type both fields!</div>
          }
        </div>
  
        <div styleName="forgot" onClick={this.onForgot}>
          Forgot password?
        </div>
      </form>
    );
    
    if (this.state.mode == MODE_FORGOT)
      content = (
        <form styleName="form" onSubmit={this.onRestore}>
          <div styleName="description">
            Type your email, and we will send your a link to reset your password.
          </div>
          <input styleName="input"
                 type="text"
                 value={this.state.email}
                 placeholder="Enter email"
                 onChange={this.onEmailChange} />
          <div styleName="button">
            <ButtonControl color="green"
                           type="submit"
                           value="Restore password" />
          </div>
  
          <div styleName="errors">
            {
              this.state.authError ==  ERROR_WRONG_PASS &&
                <div styleName="error">Wrong email!</div>
            }
            {
              this.state.emptyFields &&
                <div styleName="error">You must type both fields</div>
            }
          </div>
  
          <div styleName="forgot" onClick={this.onReturnSign}>
            Return to authorization
          </div>
        </form>
      );
  
    if (this.state.mode == MODE_FORGOT_SENDED)
      content = (
        <form styleName="form" onSubmit={this.onRestore}>
          <div styleName="description">
            The mail have sended. Check your inbox.
          </div>
        
          <div styleName="forgot" onClick={this.onReturnSign}>
            Return to authorization
          </div>
        </form>
      );
    
    
    let contents = (
      <div styleName="Sign">
        <div styleName="logo">
          <img src={require("./chisel-logo.png")} />
        </div>
        <div styleName="title">Welcome to Chisel</div>
        {content}
      </div>
    );

    return (
      <div className='container'>
        <Helmet>
          <title>Sign in / Sign up - Chisel</title>
        </Helmet>
        {contents}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    authError:     state.user.authError
  };
}

function mapDispatchToProps(dispatch) {
  return {
    userActions:  bindActionCreators({loginOrRegister, restorePassword}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Sign);
