import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';
import styles from './Sidebar.sss';
import User from 'components/sidebar/User/User';
import Sites from 'components/sidebar/Sites/Sites';

import {openPage} from 'ducks/nav';


@CSSModules(styles, {allowMultiple: true})
export default class Sidebar extends Component  {
  componentWillReceiveProps(nextProps) {
  }

  render() {
    const {nav} = this.props;
    const {openPage} = this.props.navActions;

    return (
      <div styleName="sidebar">
        <User />
        <Sites />
        <div styleName="answer-question">
          <InlineSVG styleName="icon" src={require("./question.svg")} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    nav:  state.nav
  };
}

function mapDispatchToProps(dispatch) {
  return {
    navActions: bindActionCreators({openPage}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
