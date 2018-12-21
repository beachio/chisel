import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Helmet} from "react-helmet";
import CSSModules from 'react-css-modules';
import {browserHistory} from "react-router";
import {Parse} from "parse";

import {send} from "utils/server";
import ContainerComponent from "components/elements/ContainerComponent/ContainerComponent";
import ButtonControl from "components/elements/ButtonControl/ButtonControl";
import {changePayPlan} from "ducks/user";
import {URL_PAYMENT_METHODS, URL_USERSPACE, showAlert} from "ducks/nav";
import {updateSubscription} from 'ducks/pay';
import {ALERT_TYPE_ALERT, ALERT_TYPE_CONFIRM} from "components/modals/AlertModal/AlertModal";

import styles from './PayPlans.sss';


@CSSModules(styles, {allowMultiple: true})
export class PlanControl extends Component {
  render() {
    const {onClick, payPlan, current} = this.props;
    
    let style = 'plan-content';
    let changeElm;
    
    if (current) {
      changeElm = "It's your current plan";
      style += ' current';
      
    } else if (payPlan.priceMonthly) {
      changeElm = [
        <div styleName="buttons-wrapper" key="monthly">
          <ButtonControl color="green"
                         value="Buy monthly"
                         onClick={() => onClick()} />
        </div>,
        <div styleName="buttons-wrapper" key="yearly">
          <ButtonControl color="green"
                         value="Buy yearly"
                         onClick={() => onClick(true)} />
        </div>];
      
    } else {
       changeElm =
         <div styleName="buttons-wrapper">
          <ButtonControl color="green"
                         value="Go free"
                         onClick={() => onClick()} />
         </div>;
    }
    
    return (
      <div styleName="PlanControl">
        <div styleName={style}>
          <div styleName="text">
            <div styleName="title">{payPlan.name}</div>
            <div styleName="description">Maximum sites: {payPlan.limitSites ? payPlan.limitSites : 'unlimited'}</div>
            
            {!!payPlan.priceMonthly ? [
              <div styleName="description" key="monthly">Price (monthly): ${payPlan.priceMonthly}</div>,
              <div styleName="description" key="yearly" >Price (yearly): ${payPlan.priceYearly}</div>]
            :
              <div styleName="description">Price: free</div>
            }
  
            <div styleName="change">
              {changeElm}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

@CSSModules(styles, {allowMultiple: true})
export class PayPlans extends Component {
  state = {
    pending: false
  };
  
  onUpdatePayPlan = (payPlan, isYearly = false) => {
    const payPlanUser = this.props.user.userData.payPlan;
    
    if (payPlan.isGreater(payPlanUser)) {
      let URL = `/${URL_USERSPACE}/${URL_PAYMENT_METHODS}`;
      if (payPlan)
        URL += `?plan=${payPlan.origin.id}&yearly=${isYearly}`;
      browserHistory.push(URL);
    
    } else {
      const {showAlert} = this.props.navActions;
      showAlert({
        type: ALERT_TYPE_CONFIRM,
        title: `Subscription reduction.`,
        description: "You are trying to reduce your payment plan. Are you sure?",
        onConfirm: async () => {
          this.setState({pending: true});
          
          const {updateSubscription} = this.props.payActions;
  
          if (payPlan.priceMonthly) {
            const subscription = await send(
              Parse.Cloud.run('paySubscription', {
                planId: payPlan.origin.id,
                isYearly
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
        <title>Pay plans - Chisel</title>
      </Helmet>,
    
      <ContainerComponent key="content"
                          title="Pay plans"
                          showLoader={this.state.pending} >
        <div styleName="content">
          <div styleName="label">Choose your pay plan:</div>
          <div styleName="plans">
            {payPlans.map(payPlan =>
              <PlanControl payPlan={payPlan}
                           key={payPlan.origin.id}
                           current={payPlan == payPlanUser}
                           onClick={isYearly => this.onUpdatePayPlan(payPlan, isYearly)} />)
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
