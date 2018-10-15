import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';
import {browserHistory} from 'react-router';

import User from 'components/sidebar/User/User';
import Sites from 'components/sidebar/Sites/Sites';
import {showAlert, URL_USERSPACE, URL_SITE} from 'ducks/nav';
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
      browserHistory.push(`/${URL_USERSPACE}/${URL_SITE}${nameId}`);
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
          <a styleName="answer-question" href="http://guild.beach.io" target="_blank">
            <InlineSVG styleName="icon" src={require("./question.svg")} />
          </a>
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
