import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import {connect} from 'react-redux';
import {Helmet} from "react-helmet";
import {browserHistory} from 'react-router';

import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import {USERSPACE_URL, SIGN_URL} from 'ducks/nav';

import styles from './InvalidLink.sss';


@CSSModules(styles, {allowMultiple: true})
export class InvalidLink extends Component  {
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
          <title>Invalid link - Chisel</title>
        </Helmet>
        <div styleName="InvalidLink">
          <div styleName="logo">
            <img src={require("assets/images/chisel-logo.png")} />
          </div>
          <div styleName="title">The link is invalid.</div>
          <form styleName="form" onSubmit={this.onLogin}>
            <div styleName="button">
              <ButtonControl color="green"
                             type="submit"
                             value="OK" />
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

export default connect(mapStateToProps)(InvalidLink);