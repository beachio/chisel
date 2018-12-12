import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Helmet} from "react-helmet";
import CSSModules from 'react-css-modules';

import ContainerComponent from "components/elements/ContainerComponent/ContainerComponent";
import ButtonControl from "components/elements/ButtonControl/ButtonControl";
import {changePayPlan} from "ducks/user";

import styles from './PayPlans.sss';



@CSSModules(styles, {allowMultiple: true})
export class PlanControl extends Component {
  state = {
    checked: false
  };
  payPlan = null;
  
  constructor(props) {
    super(props);
    
    this.payPlan = props.payPlan;
    this.state.checked = props.checked;
  }
  
  componentWillReceiveProps({checked}) {
    this.setState({checked});
  }
  
  onClick = () => {
    this.props.onChange(this.payPlan);
  };
  
  render() {
    let style = 'plan-content';
    if (this.state.checked)
      style += ' checked';
    
    return (
      <div styleName="PlanControl"
           onClick={this.onClick}>
        <div styleName={style}>
          <div styleName="text">
            <div styleName="title">{this.payPlan.name}</div>
            <div styleName="description">Maximum sites: {this.payPlan.limitSites ? this.payPlan.limitSites : 'unlimited'}</div>
            <div styleName="description">Price (monthly): ${this.payPlan.priceMonthly}</div>
            <div styleName="description">Price (yearly): ${this.payPlan.priceYearly}</div>
          </div>
        </div>
      </div>
    );
  }
}

@CSSModules(styles, {allowMultiple: true})
export class PayPlans extends Component {
  state = {
    payPlan: null
  };
  payPlans = [];
  
  constructor(props) {
    super(props);
    
    this.payPlans = props.pay.payPlans;
    this.state.payPlan = props.user.userData.payPlan;
  }
  
  onChangePayPlan = payPlan => {
    this.setState({payPlan});
  };
  
  onUpdatePayPlan = () => {
    this.props.userActions.changePayPlan(this.state.payPlan);
  };
  
  render() {
    const {userData} = this.props.user;
    
    return [
      <Helmet key="helmet">
        <title>Pay plans - Chisel</title>
      </Helmet>,
    
      <ContainerComponent key="content" title="Pay plans">
        <div>
          <div styleName="label">Choose your pay plan:</div>
          <div styleName="plans">
            {this.payPlans.map(payPlan =>
              <PlanControl payPlan={payPlan}
                           key={payPlan.origin.id}
                           checked={this.state.payPlan == payPlan}
                           onChange={this.onChangePayPlan} />)
            }
          </div>
        </div>
  
        
        <div styleName="buttons-wrapper">
          <ButtonControl color="green"
                         onClick={this.onUpdatePayPlan}
                         value="Update pay plan"
                         disabled={this.state.payPlan == userData.payPlan} />
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
