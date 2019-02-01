import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';
import {browserHistory, Link} from 'react-router';

import Sites from 'components/sidebar/Sites/Sites';
import {showModal, showAlert, URL_USERSPACE, URL_SITE, URL_PAY_PLANS} from 'ducks/nav';
import {isPayPlanTop} from 'utils/data';

import styles, {sidebarHidden} from './Sidebar.sss';


@CSSModules(styles, {allowMultiple: true})
export class Sidebar extends Component {
  render() {
    const {models, isSidebarVisible} = this.props;
    const {userData} = this.props.user;
    const {stripeInitError, payPlans} = this.props.pay;
    const {showModal, showAlert} = this.props.navActions;
  
    const gotoSite = site => {
      const nameId = site.nameId;
      browserHistory.push(`/${URL_USERSPACE}/${URL_SITE}${nameId}`);
    };

    const showPay = !stripeInitError && !!payPlans && !!payPlans.length;
    const showUpgrade = showPay && !isPayPlanTop(userData.payPlan);

    return (
      <div styleName="sidebar"
           className={isSidebarVisible ? `sidebar-visible` : sidebarHidden}>
        <div styleName="header">
          Chisel
        </div>
        <div styleName="sites-wrapper">
          <Sites sites={models.sites}
                 currentSite={models.currentSite}
                 gotoSite={gotoSite}
                 payPlan={showPay ? userData.payPlan : null}
                 showModal={showModal}
                 showAlert={showAlert} />
        </div>
  
        <div styleName="bottom-panel">
          {showUpgrade &&
            <Link styleName="pay-plans"
                  to={`/${URL_USERSPACE}/${URL_PAY_PLANS}/`}>
              Upgrade your account
            </Link>
          }
        
          {/* <a styleName="answer-question" href="http://guild.beach.io" target="_blank">
            <InlineSVG styleName="icon" src={require("./question.svg")} />
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
