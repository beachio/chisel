import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';

import ButtonControl from 'components/elements/ButtonControl/ButtonControl';

import {loginOrRegister, ERROR_WRONG_PASS} from 'ducks/user';

import styles from './Sign.sss';


@CSSModules(styles, {allowMultiple: true})
export default class Sign extends Component  {
  state = {
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

  onSubmit = (event) => {
    event.preventDefault();
    const {loginOrRegister} = this.props.userActions;
    if (this.state.email.length && this.state.password.length)
      loginOrRegister(this.state.email, this.state.password);
    else
      this.setState({emptyFields: true});
    return false;
  };

  render() {
    let contents = (
      <div styleName="Sign">
        <div styleName="title">Welcome to Scriven</div>
        <div styleName="logo">
          <img src={require("./logo.png")} />
        </div>
        <form styleName="form" onSubmit={this.onSubmit}>
          <input styleName="input" type="text" placeholder="Enter email" onChange={this.onEmailChange} />
          <input styleName="input" type="password" placeholder="Enter password" onChange={this.onPasswordChange} />
          <div styleName="button">
            <ButtonControl type="green" value="Sign in / Sign up" onClick={this.onSubmit}/>
          </div>
        </form>

        <div styleName="errors">
          {
            this.state.authError ==  ERROR_WRONG_PASS &&
              <div styleName="error">Wrong password!</div>
          }
          {
            this.state.emptyFields &&
              <div styleName="error">You must type both fields</div>
          }
        </div>
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
