import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';
import {Helmet} from "react-helmet";
import {browserHistory} from 'react-router';

import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import {USERSPACE_URL, SIGN_URL} from 'ducks/nav';

import styles from './EmailVerify.sss';


@CSSModules(styles, {allowMultiple: true})
export class EmailVerify extends Component  {
  onLogin = event => {
    event.preventDefault();
    
    if (this.props.authorized)
      browserHistory.replace(`/${USERSPACE_URL}`);
    else
      browserHistory.replace(`/${SIGN_URL}`);
    
    return false;
  };
  
  render() {
    return (
      <div className='container'>
        <Helmet>
          <title>Verifying email - Chisel</title>
        </Helmet>
        <div styleName="EmailVerify">
          <div styleName="logo">
            <img src={require("assets/images/chisel-logo.png")} />
          </div>
          <div styleName="title">Your email was verified successfully.</div>
          <form styleName="form" onSubmit={this.onLogin}>
            <div styleName="button">
              <ButtonControl color="green"
                             type="submit"
                             value="Log in" />
            </div>
          </form>
        </div>
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
