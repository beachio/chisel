import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import {connect} from 'react-redux';
import {Helmet} from "react-helmet-async";

import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import {URL_USERSPACE, URL_SIGN} from 'ducks/nav';
import {withRouter} from 'utils/routing';

import styles from './InvalidLink.sss';

import ImageChiselLogo from 'assets/images/chisel-logo.png';


@CSSModules(styles, {allowMultiple: true})
export class InvalidLink extends Component  {
  onLogin = event => {
    event.preventDefault();
    
    const {navigate} = this.props.router;
    if (this.props.authorized)
      navigate(`/${URL_USERSPACE}`, {replace: true});
    else
      navigate(`/${URL_SIGN}`, {replace: true});
    
    return false;
  };
  
  render() {
    return (
      <div styleName='InvalidLink'>
        <Helmet>
          <title>Invalid link - Chisel</title>
        </Helmet>
        <div styleName="logo">
          <img src={ImageChiselLogo} />
        </div>
        <div styleName="title">The link is invalid.</div>
        <form styleName="form" onSubmit={this.onLogin}>
          <div styleName="button">
            <ButtonControl color="green"
                           type="submit"
                           value="Goto Home" />
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

export default withRouter(connect(mapStateToProps)(InvalidLink));