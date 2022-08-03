import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';
import {NavLink} from 'react-router-dom';

import Sites from 'components/sidebar/Sites/Sites';
import {showModal, showAlert, URL_USERSPACE, URL_SITE, URL_PAY_PLANS} from 'ducks/nav';
import {isPayPlanTop} from 'utils/data';

import styles from './Sidebar.sss';
import {useNavigate} from "react-router-dom";



function Sidebar(props) {
  const {models, isSidebarVisible} = props;
  const {userData} = props.user;
  const {stripeInitError} = props.pay;
  const {showModal, showAlert} = props.navActions;
  const navigate = useNavigate();

  const gotoSite = site => {
    const nameId = site.nameId;
    navigate(`/${URL_USERSPACE}/${URL_SITE}${nameId}`);
  };

  const showPay = !!userData.payPlan;
  const showPayUpgrade = showPay && !stripeInitError && !isPayPlanTop(userData.payPlan);

  return (
    <div styleName="sidebar"
         className={isSidebarVisible ? `sidebar-visible` : styles.sidebarHidden}>
      <NavLink styleName="header" to="/userspace">
        Chisel
      </NavLink>
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
          <NavLink styleName="bottom-link"
                   to={`/${URL_USERSPACE}/${URL_PAY_PLANS}/`}>
            Upgrade your account
          </NavLink>
        }
        <a styleName="bottom-link"
           href="http://guild.beach.io"
           target="_blank" >
          Need help?
        </a>
      </div>
    </div>
  );
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

export default connect(mapStateToProps, mapDispatchToProps)(CSSModules(Sidebar, styles, {allowMultiple: true}));
