import React, {Component} from 'react';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';
import {Helmet} from "react-helmet-async";

import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import {URL_USERSPACE, URL_SIGN} from 'ducks/nav';
import {withRouter} from 'utils/routing';

import styles from './EmailVerify.sss';

import ImageChiselLogo from 'assets/images/chisel-logo.png';


@CSSModules(styles, {allowMultiple: true})
export class EmailVerify extends Component  {
  onLogin = event => {
    event.preventDefault();
    
    const {history} = this.props.router;
    if (this.props.authorized)
      history.replace(`/${URL_USERSPACE}`);
    else
      history.replace(`/${URL_SIGN}`);
    
    return false;
  };
  
  render() {
    return (
      <div styleName="EmailVerify">
        <Helmet>
          <title>Verifying email - Chisel</title>
        </Helmet>
        <div styleName="logo">
          <img src={ImageChiselLogo} />
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

export default withRouter(connect(mapStateToProps)(EmailVerify));
