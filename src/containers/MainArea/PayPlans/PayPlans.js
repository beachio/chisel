import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Helmet} from "react-helmet";
import CSSModules from 'react-css-modules';
import {browserHistory} from "react-router";

import ContainerComponent from "components/elements/ContainerComponent/ContainerComponent";
import ButtonControl from "components/elements/ButtonControl/ButtonControl";
import SwitchControl from 'components/elements/SwitchControl/SwitchControl';
import {changePayPlan} from "ducks/user";
import {URL_PAYMENT_METHODS, URL_USERSPACE} from "ducks/nav";

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
      
    } 
    else if (payPlan.priceMonthly) {
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
export class NewPlanControl extends Component {
  render() {
    return (
      [
      <div styleName="card" key="1">
        <div styleName="card-title">
          Starter
        </div>
        <div styleName="card-cost">
          $0<span>/mo</span>
        </div>
        <div styleName="card-sites">
          Sites
        </div>
        <div styleName="card-number">
          1
        </div>
        <div styleName="card-button downgrade">
          Current Plan
        </div>
      </div>,
      <div styleName="card" key="2">
        <div styleName="card-title">
          Starter
        </div>
        <div styleName="card-cost">
          $50<span>/mo</span>
        </div>
        <div styleName="card-sites">
          Sites
        </div>
        <div styleName="card-number">
          1
        </div>
        <div styleName="card-button upgrade">
          Current Plan
        </div>
      </div>,
      <div styleName="card" key="3">
        <div styleName="card-title">
          Starter
        </div>
        <div styleName="card-cost">
          $50<span>/mo</span>
        </div>
        <div styleName="card-sites">
          Sites
        </div>
        <div styleName="card-number">
          10
        </div>
        <div styleName="card-button upgrade">
          Current Plan
        </div>
      </div>
      ]
    )
  }
}


@CSSModules(styles, {allowMultiple: true})
export class PayPlans extends Component {
  state = {
    period: 'monthly'
  }

  onChangePeriod = () => {
    this.state.period === 'monthly' ?
      this.setState({period: 'yearly'}) :
      this.setState({period: 'monthly'})
  }

  onUpdatePayPlan = (payPlan, isYearly = false) => {
    let URL = `/${URL_USERSPACE}/${URL_PAYMENT_METHODS}`;
    if (payPlan)
      URL += `?plan=${payPlan.origin.id}&yearly=${isYearly}`;
    browserHistory.push(URL);
  };
  
  render() {
    const {payPlans} = this.props.pay;
    const payPlanUser = this.props.user.userData.payPlan;
    
    return [
      <Helmet key="helmet">
        <title>Pay plans - Chisel</title>
      </Helmet>,
    
      <ContainerComponent key="content" title="Billing">
        <div styleName="content">
          <div styleName="head">
            <div styleName="label">
              Current Plan: <span> Starter </span>
            </div>

            <div styleName={`period ${this.state.period}`} onClick={() => this.onChangePeriod() }>
              <div htmlFor="check" styleName="monthly">
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
                           current={payPlan == payPlanUser}
                           onClick={isYearly => this.onUpdatePayPlan(payPlan, isYearly)} />)
            }

            {/* static */}
            {/* <NewPlanControl /> */}
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
    userActions: bindActionCreators({changePayPlan}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PayPlans);
