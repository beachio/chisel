import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';
import styles from './Sidebar.sss';
import User from 'components/sidebar/User/User';
import Sites from 'components/sidebar/Sites/Sites';

import {openPage} from 'ducks/nav';
import {setCurrentSite, addSite} from 'ducks/sites';


@CSSModules(styles, {allowMultiple: true})
export default class Sidebar extends Component {
  render() {
    const {sites, user} = this.props;
    const {setCurrentSite, addSite} = this.props.siteActions;

    return (
      <div styleName="sidebar">
        <User userData={user.userData} />
        <Sites sites={sites.sitesUser}
               currentSite={sites.currentSite}
               setCurrentSite={setCurrentSite}
               addSite={addSite} />
        <div styleName="answer-question">
          <InlineSVG styleName="icon" src={require("./question.svg")} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    sites:  state.sites,
    user:   state.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    navActions:   bindActionCreators({openPage}, dispatch),
    siteActions:  bindActionCreators({setCurrentSite, addSite}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
