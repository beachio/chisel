import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';
import {browserHistory, Link} from 'react-router';

import User from 'components/sidebar/User/User';
import Sites from 'components/sidebar/Sites/Sites';
import {showModal, showAlert, URL_USERSPACE, URL_SITE, URL_PAY_PLANS} from 'ducks/nav';

import styles from './Sidebar.sss';


@CSSModules(styles, {allowMultiple: true})
export class Sidebar extends Component {
  render() {
    const {models, user} = this.props;
    const {showModal, showAlert} = this.props.navActions;
  
    const gotoSite = site => {
      const nameId = site.nameId;
      browserHistory.push(`/${URL_USERSPACE}/${URL_SITE}${nameId}`);
    };

    return (
      <div styleName="sidebar">
        <div>
          <User userData={user.userData} />
          <Sites sites={models.sites}
                 currentSite={models.currentSite}
                 gotoSite={gotoSite}
                 payPlan={user.userData.payPlan}
                 showModal={showModal}
                 showAlert={showAlert} />
        </div>
  
        <div styleName="bottom-panel">
          <Link styleName="pay-plans"
                to={`/${URL_USERSPACE}/${URL_PAY_PLANS}/`}>
            Upgrade your account
          </Link>
        
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
    user:   state.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    navActions:     bindActionCreators({showModal, showAlert}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
