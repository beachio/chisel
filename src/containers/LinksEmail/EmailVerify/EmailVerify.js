import React, {Component} from 'react';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';
import {Helmet} from "react-helmet-async";
import {browserHistory} from 'react-router';

import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import {URL_USERSPACE, URL_SIGN} from 'ducks/nav';

import styles from './EmailVerify.sss';


@CSSModules(styles, {allowMultiple: true})
export class EmailVerify extends Component  {
  onLogin = event => {
    event.preventDefault();
    
    if (this.props.authorized)
      browserHistory.replace(`/${URL_USERSPACE}`);
    else
      browserHistory.replace(`/${URL_SIGN}`);
    
    return false;
  };
  
  render() {
    return (
      <div styleName="EmailVerify">
        <Helmet>
          <title>Verifying email - Chisel</title>
        </Helmet>
        <div styleName="logo">
          <img src={require("assets/images/chisel-logo.png")} />
        </div>
        <div styleName="title">Your email was verified successfully.</div>
        <form styleName="form" onSubmit={this.onLogin}>
          <div styleName="button">
            <ButtonControl color="green"
                           type="submit"
                           value="Log In" />
          </div>
        </form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    authorized: state.user.authorized
  };
}

export default connect(mapStateToProps)(EmailVerify);
