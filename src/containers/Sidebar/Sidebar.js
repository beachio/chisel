import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';
import {browserHistory} from 'react-router';

import User from 'components/sidebar/User/User';
import Sites from 'components/sidebar/Sites/Sites';
import {showAlert, USERSPACE_URL, SITE_URL} from 'ducks/nav';
import {addSite, updateSite} from 'ducks/models';

import styles from './Sidebar.sss';


@CSSModules(styles, {allowMultiple: true})
export class Sidebar extends Component {
  render() {
    const {models, nav, user} = this.props;
    const {addSite, updateSite} = this.props.modelsActions;
    const {showAlert} = this.props.navActions;
    
    let gotoSite = site => {
      let nameId = site.nameId;
      browserHistory.push(`/${USERSPACE_URL}/${SITE_URL}${nameId}`);
    };

    return (
      <div styleName="sidebar">
        <div>
          <User userData={user.userData} />
          <Sites sites={models.sites}
                 currentSite={models.currentSite}
                 gotoSite={gotoSite}
                 addSite={addSite}
                 updateSite={updateSite}
                 showAlert={showAlert}
                 alertShowing={nav.alertShowing} />
        </div>
        <div styleName="answer-wrapper">
          <div styleName="answer-question">
            <InlineSVG styleName="icon" src={require("./question.svg")} />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    models: state.models,
    nav:    state.nav,
    user:   state.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    modelsActions:  bindActionCreators({addSite, updateSite}, dispatch),
    navActions:     bindActionCreators({showAlert}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
