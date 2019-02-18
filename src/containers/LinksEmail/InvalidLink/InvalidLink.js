import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import {connect} from 'react-redux';
import {Helmet} from "react-helmet";
import {browserHistory} from 'react-router';

import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import {URL_USERSPACE, URL_SIGN} from 'ducks/nav';

import styles from './InvalidLink.sss';


@CSSModules(styles, {allowMultiple: true})
export class InvalidLink extends Component  {
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
      <div styleName='InvalidLink'>
        <Helmet>
          <title>Invalid link - Chisel</title>
        </Helmet>
        <div styleName="logo">
          <img src={require("assets/images/chisel-logo.png")} />
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

export default connect(mapStateToProps)(InvalidLink);