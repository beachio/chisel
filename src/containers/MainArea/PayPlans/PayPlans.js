import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Helmet} from "react-helmet-async";
import CSSModules from 'react-css-modules';
import {browserHistory} from "react-router";
import {Parse} from "parse";

import {send} from "utils/server";
import ContainerComponent from "components/elements/ContainerComponent/ContainerComponent";
import {checkPayPlan} from "ducks/user";
import {URL_PAYMENT_METHODS, URL_USERSPACE, showAlert, returnHome} from "ducks/nav";
import {updateSubscription} from 'ducks/pay';
import {ALERT_TYPE_ALERT, ALERT_TYPE_CONFIRM} from "components/modals/AlertModal/AlertModal";

import styles from './PayPlans.sss';


@CSSModules(styles, {allowMultiple: true})
export class PlanControl extends Component {
  render() {
    const {onClick, payPlan, payPlanUser, isYearly, cancelSub} = this.props;
    
    let btnStyle = '';
    let btnText;

    if (!cancelSub && payPlanUser == payPlan  ||  cancelSub && payPlan.isFree) {
      btnText = "It's your current plan";

    } else if (payPlan.greaterThan(payPlanUser)  ||  cancelSub) {
      btnText = "Upgrade";
      btnStyle = 'upgrade';
      
    } else {
      btnText = "Downgrade";
      btnStyle = 'downgrade';
    }
    
    return (
      <div styleName="PlanControl">
        <div styleName="title">{payPlan.name}</div>

        {payPlan.isFree ?
          <div styleName="cost">Free</div>
        :
          <div styleName="cost">
            ${isYearly ? payPlan.priceYearly : payPlan.priceMonthly}<span>{isYearly ? '/year' : '/month'}</span>
          </div>
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
      const {showAlert, returnHome} = this.props.navActions;
      
      let description = `You are going to upgrade your payment plan. Are you sure?`;
      if (payPlanUser.greaterThan(payPlan)) {
        if (payPlan.isFree)
          description = `You are going to reduce your payment plan. Are you sure? <br/>(Your current subscription will change in the end of the payment period.)`;
        else
          description = `You are going to reduce your payment plan. Are you sure? <br/>(Your rest of the money will be used in next payments.)`;
      }

      showAlert({
        type: ALERT_TYPE_CONFIRM,
        title: `Changing subscription`,
        description,
        onConfirm: async () => {
          this.setState({pending: true});
          
          const {updateSubscription} = this.props.payActions;

          let subscription;
          if (payPlan.isFree) {
            subscription = await send(
              Parse.Cloud.run('cancelSubscription')
            );
            updateSubscription(subscription, payPlan);
            this.props.userActions.checkPayPlan();

          } else {
            subscription = await send(
              Parse.Cloud.run('paySubscription', {
                planId: payPlan.origin.id,
                isYearly: this.state.isYearly
              })
            );
            updateSubscription(subscription, payPlan);
          }
  
          this.setState({pending: false});
          
          showAlert({
            type: ALERT_TYPE_ALERT,
            title: "Payment complete",
            description: `You are successfully change your subscription to ${payPlan.name}.`,
            callback: returnHome
          });
        }
      });
    }
  };
  
  render() {
    const {payPlans, stripeData} = this.props.pay;
    const payPlanUser = this.props.user.userData.payPlan;

    const cancelSub = stripeData.subscription ? stripeData.subscription.cancel_at_period_end : false;
    
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
                           cancelSub={cancelSub}
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
    navActions: bindActionCreators({showAlert, returnHome}, dispatch),
    payActions: bindActionCreators({updateSubscription}, dispatch),
    userActions: bindActionCreators({checkPayPlan}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PayPlans);
