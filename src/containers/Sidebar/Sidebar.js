import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';
import {browserHistory, Link} from 'react-router';

import Sites from 'components/sidebar/Sites/Sites';
import {showModal, showAlert, URL_USERSPACE, URL_SITE, URL_PAY_PLANS} from 'ducks/nav';
import {isPayPlanTop} from 'utils/data';

import styles from './Sidebar.sss';

import ImageQuestion from './question.svg';



@CSSModules(styles, {allowMultiple: true})
export class Sidebar extends Component {
  render() {
    const {models, isSidebarVisible} = this.props;
    const {userData} = this.props.user;
    const {stripeInitError} = this.props.pay;
    const {showModal, showAlert} = this.props.navActions;
  
    const gotoSite = site => {
      const nameId = site.nameId;
      browserHistory.push(`/${URL_USERSPACE}/${URL_SITE}${nameId}`);
    };

    const showPay = !!userData.payPlan;
    const showPayUpgrade = showPay && !stripeInitError && !isPayPlanTop(userData.payPlan);

    return (
      <div styleName="sidebar"
           className={isSidebarVisible ? `sidebar-visible` : styles.sidebarHidden}>
        <Link styleName="header" to="/">
          Chisel
        </Link>
        <div styleName="sites-wrapper">
          <Sites sites={models.sites}
                 currentSite={models.currentSite}
                 gotoSite={gotoSite}
                 payPlan={userData.payPlan}
                 showPayUpgrade={showPayUpgrade}
                 showModal={showModal}
                 showAlert={showAlert} />
        </div>
  
        <div styleName="bottom-panel">
          {showPayUpgrade &&
            <Link styleName="pay-plans"
                  to={`/${URL_USERSPACE}/${URL_PAY_PLANS}/`}>
              Upgrade your account
            </Link>
          }
        
          {/* <a styleName="answer-question" href="http://guild.beach.io" target="_blank">
            <InlineSVG styleName="icon" src={ImageQuestion} />
          </a> */}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    models: state.models,
    user:   state.user,
    pay:    state.pay
  };
}

function mapDispatchToProps(dispatch) {
  return {
    navActions:     bindActionCreators({showModal, showAlert}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
