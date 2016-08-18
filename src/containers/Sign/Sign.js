import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';

import {loginOrRegister, ERROR_USER_EXISTS, ERROR_WRONG_PASS} from 'ducks/user';

import styles from './Sign.sss';


@CSSModules(styles, {allowMultiple: true})
export default class Sign extends Component  {
  state = {
    email: '',
    password: '',
    alreadyHasAccount: false,
    emptyFields: false
  };

  onEmailChange = event => {
    this.setState({
      email: event.target.value,
      emptyFields: false
    });
  };

  onPasswordChange = event => {
    this.setState({
      password: event.target.value,
      emptyFields: false
    });
  };

  onSubmit = (event) => {
    event.preventDefault();
    const {loginOrRegister} = this.props.userActions;
    if (this.state.email.length && this.state.password.length)
      loginOrRegister(this.state.email, this.state.password);
    else
      this.setState({emptyFields: true});
    return false;
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      alreadyHasAccount: this.state.alreadyHasAccount || nextProps.authError == ERROR_USER_EXISTS
    });
  }

  render() {
    const {authError} = this.props;

    let contents = (
      <div styleName="Sign">
        <div styleName="title">Welcome to Scrivener</div>
        <div styleName="subtitle">The best CMS ever! </div>

        <form styleName="form" onSubmit={this.onSubmit}>
          <input styleName="input" type="text" placeholder="Enter email" onChange={this.onEmailChange} />
          <input styleName="input" type="password" placeholder="Enter password" onChange={this.onPasswordChange} />
          <div styleName="button" onClick={this.onSubmit}>
            <div styleName="button-inner">Get Started!</div>
          </div>
          {
            authError ==  ERROR_WRONG_PASS &&
              <div styleName="or">Wrong password!</div>
          }
          {
            this.state.emptyFields &&
              <div styleName="or">You must type both fields</div>
          }
        </form>
      </div>
    );

    return (
        <div>
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
    userActions:  bindActionCreators({loginOrRegister}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Sign);