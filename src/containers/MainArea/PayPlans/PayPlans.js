import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Helmet} from "react-helmet";
import CSSModules from 'react-css-modules';
import {browserHistory} from "react-router";
import {Parse} from "parse";

import {send} from "utils/server";
import ContainerComponent from "components/elements/ContainerComponent/ContainerComponent";
import {changePayPlan} from "ducks/user";
import {URL_PAYMENT_METHODS, URL_USERSPACE, showAlert} from "ducks/nav";
import {updateSubscription} from 'ducks/pay';
import {ALERT_TYPE_ALERT, ALERT_TYPE_CONFIRM} from "components/modals/AlertModal/AlertModal";

import styles from './PayPlans.sss';


@CSSModules(styles, {allowMultiple: true})
export class PlanControl extends Component {
  render() {
    const {onClick, payPlan, payPlanUser, isYearly} = this.props;
    
    let btnStyle = '';
    let btnText;
    
    if (payPlanUser == payPlan) {
      btnText = "It's your current plan";

    } else if (payPlan.greaterThan(payPlanUser)) {
      btnText = "Upgrade";
      btnStyle = 'upgrade';
      
    } else {
      btnText = "Downgrade";
      btnStyle = 'downgrade';
    }
    
    return (
      <div styleName="PlanControl">
        <div styleName="title">{payPlan.name}</div>

        {!!payPlan.priceMonthly ?
          <div styleName="cost">
            ${isYearly ? payPlan.priceYearly : payPlan.priceMonthly}<span>{isYearly ? '/year' : '/month'}</span>
          </div>
        :
          <div styleName="cost">Free</div>
        }

        <div styleName="sites-title">Sites</div>
        <div styleName="sites-number">{payPlan.limitSites ? payPlan.limitSites : 'unlimited'}</div>

        <div styleName={`button ${btnStyle}`} onClick={onClick}>
          {btnText}
        </div>
      </div>
    );
  }
}


@CSSModules(styles, {allowMultiple: true})
export class PayPlans extends Component {
  state = {
    isYearly: false
  };

  onChangePeriod = () => {
    this.setState({isYearly: !this.state.isYearly});
  };

  onUpdatePayPlan = (payPlan) => {
    const {stripeData} = this.props.pay;
    const payPlanUser = this.props.user.userData.payPlan;
    
    if (!stripeData.sources || !stripeData.sources.length) {
      let URL = `/${URL_USERSPACE}/${URL_PAYMENT_METHODS}`;
      if (payPlan)
        URL += `?plan=${payPlan.origin.id}&yearly=${this.state.isYearly}`;
      browserHistory.push(URL);
    
    } else {
      const {showAlert} = this.props.navActions;
      
      let description = `You are going to upgrade your payment plan. Are you sure?`;
      if (payPlanUser.greaterThan(payPlan))
        description = `You are going to reduce your payment plan. Are you sure? <br/>(Your rest of the money will be used in next payments.)`;
      
      showAlert({
        type: ALERT_TYPE_CONFIRM,
        title: `Changing subscription`,
        description,
        onConfirm: async () => {
          this.setState({pending: true});
          
          const {updateSubscription} = this.props.payActions;
  
          if (payPlan.priceMonthly) {
            const subscription = await send(
              Parse.Cloud.run('paySubscription', {
                planId: payPlan.origin.id,
                isYearly: this.state.isYearly
              })
            );
            updateSubscription(subscription, payPlan);
          } else {
            await send(
              Parse.Cloud.run('cancelSubscription')
            );
            updateSubscription(null, payPlan);
          }
  
          this.setState({pending: false});
          
          showAlert({
            type: ALERT_TYPE_ALERT,
            title: "Payment complete",
            description: `You are successfully change your subscription to ${payPlan.name}.`,
            callback: () => browserHistory.push(`/${URL_USERSPACE}`)
          });
        }
      });
    }
  };
  
  render() {
    const {payPlans} = this.props.pay;
    const payPlanUser = this.props.user.userData.payPlan;
    
    return [
      <Helmet key="helmet">
        <title>Billing - Chisel</title>
      </Helmet>,
    
      <ContainerComponent key="content"
                          title="Billing"
                          showLoader={this.state.pending} >
        <div styleName="content">
          <div styleName="head">
            <div styleName="label">
              Current Plan: <span>{payPlanUser.name}</span>
            </div>

            <div styleName={`period ${this.state.isYearly ? 'yearly' : 'monthly'}`}
                 onClick={this.onChangePeriod}>
              <div styleName="monthly">
                Monthly
              </div> 
              <div styleName="checkbox-wrapper">
                <span styleName="circle"/>
              </div>
              <div styleName="yearly">
                Yearly
              </div> 
            </div>
          </div>
          <div styleName="plans">
            {payPlans.map(payPlan =>
              <PlanControl payPlan={payPlan}
                           key={payPlan.origin ? payPlan.origin.id : 1}
                           payPlanUser={payPlanUser}
                           isYearly={this.state.isYearly}
                           onClick={() => this.onUpdatePayPlan(payPlan)} />)
            }
          </div>
        </div>
        
      </ContainerComponent>
    ];
  }
}


function mapStateToProps(state) {
  return {
    pay: state.pay,
    user: state.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    navActions: bindActionCreators({showAlert}, dispatch),
    payActions: bindActionCreators({updateSubscription}, dispatch),
    userActions: bindActionCreators({changePayPlan}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PayPlans);
