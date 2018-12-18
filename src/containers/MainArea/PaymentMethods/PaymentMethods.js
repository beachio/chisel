import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import {CardElement, injectStripe, Elements} from 'react-stripe-elements';
import {Parse} from 'parse';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import {Helmet} from "react-helmet";

import ButtonControl from "components/elements/ButtonControl/ButtonControl";
import CheckboxControl from "components/elements/CheckboxControl/CheckboxControl";
import ContainerComponent from 'components/elements/ContainerComponent/ContainerComponent';
import {send} from 'utils/server';
import {update as updateUser} from "ducks/user";
import {showAlert} from "ducks/nav";
import {addSource, removeSource, updateSubscription} from 'ducks/pay';
import {getPayPlan} from "utils/data";


import styles from './PaymentMethods.sss';


@CSSModules(styles, {allowMultiple: true})
class _PayElement extends Component {
  state = {
    saveMethod: true
  };
  
  submit = async (e) => {
    e.preventDefault();
    
    const {onStart, onComplete} = this.props;
    
    onStart();
    const {token} = await this.props.stripe.createToken({name: "Card 1"});
    onComplete(token, this.state.saveMethod);
  };
  
  onSaveMethodCheck = checked => {
    this.setState({saveMethod: checked});
  };
  
  render() {
    const style = {
      base: {
        fontSize: '13px',
        fontWeight: '300',
        fontFamily: "Open Sans, sans-serif",
        color: '#666666',
        '::placeholder': {
          color: '#999999',
        }
      },
      invalid: {
        color: '#9e2146',
      }
    };
    
    return (
      <form onSubmit={this.submit} styleName="form">
        <label styleName="label">
          Card details
          <div styleName="card-wrapper">
            <CardElement style={style} />
          </div>
        </label>
        <div styleName="checkbox-wrapper">
          <CheckboxControl title="Save payment method"
                           checked={this.state.saveMethod}
                           disabled={this.props.disabled}
                           onChange={this.onSaveMethodCheck} />
        </div>
        <div styleName="button-wrapper">
          <ButtonControl color="green"
                         type="submit"
                         disabled={this.props.disabled}
                         showLoader={this.props.disabled}
                         value="Subscribe" />
        </div>
      </form>
    );
  }
}

export const PayElement = injectStripe(_PayElement);


@CSSModules(styles, {allowMultiple: true})
class PaymentMethods extends Component {
  state = {
    method: null,
    pending: false,
    pendingSubscribe: false,
    pendingRemove: false
  };
  
  payPlan;
  isYearly;
  
  
  constructor(props) {
    super(props);
    
    const {paymentInfo} = props.user.userData;
    if (paymentInfo && paymentInfo.length)
      this.state.method = paymentInfo[paymentInfo.length - 1];
  
    if (props.location && props.location.query) {
      if (props.location.query.plan)
        this.payPlan = getPayPlan(props.location.query.plan);
      this.isYearly = props.location.query.yearly == 'true';
    }
  }
  
  onNewSourceSubscribe = async (token, saveMethod) => {
    const {userData} = this.props.user;
    const {updateUser} = this.props.userActions;
    const {addSource, updateSubscription} = this.props.payActions;
    
    try {
      this.setState({pending: true});
      const StripeId = await send(
        Parse.Cloud.run('savePaymentSource', {tokenId: token.id, card: token.card})
      );
      if (StripeId) {
        userData.StripeId = StripeId;
        updateUser(userData);
      }
      addSource(token.card);
      
      const subscription = await send(
        Parse.Cloud.run('paySubscription', {
          planId: this.payPlan.origin.id,
          source: token.card.id,
          isYearly: this.isYearly
        })
      );
      updateSubscription(subscription);
    
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({pending: false});
    }
  };
  
  onSubscribe = async () => {
    const {updateSubscription} = this.props.payActions;
    
    try {
      this.setState({pending: true, pendingSubscribe: true});
      const subscription = await send(
        Parse.Cloud.run('paySubscription', {
          planId: this.payPlan.origin.id,
          source: this.state.method.id,
          isYearly: this.isYearly
        })
      );
      updateSubscription(subscription);
    } catch (e) {
    } finally {
      this.setState({pending: false, pendingSubscribe: false});
    }
  };
  
  onRemoveMethod = async () => {
    const {removeSource} = this.props.payActions;
    
    try {
      this.setState({pending: true, pendingRemove: true});
      await send(
        Parse.Cloud.run('removePaymentSource', {source: this.state.method.id})
      );
      removeSource(this.state.method);
    } catch (e) {
    } finally {
      this.setState({pending: false, pendingRemove: false});
    }
  };
  
  onMethodClick = method => {
    this.setState({method});
  };
  
  render() {
    const {stripeData} = this.props;
    let methods = [];
    if (stripeData)
      methods = stripeData.sources;
    
    let newMethodStyle = "method method-new";
    if (!this.state.method)
      newMethodStyle += " method-checked";
    
    return [
      <Helmet key="helmet">
        <title>Payment methods - Chisel</title>
      </Helmet>,
    
      <ContainerComponent key="content" title="Payment methods">
        <div styleName="content">
          <div styleName="side">
            <div styleName="title">
              Your payment methods
            </div>
            {methods &&
              methods.map(method => {
                let style = "method";
                if (method == this.state.method)
                  style += " method-checked";
                return (
                  <div styleName={style}
                       key={method.id} onClick={() => this.onMethodClick(method)}>
                    <div styleName="name">
                      {method.brand} xxxx-{method.last4}
                    </div>
                  </div>
                );
              })
            }
            
            <div styleName={newMethodStyle}
                 onClick={() => this.onMethodClick()}>
              <div styleName="name">
                Add new payment method
              </div>
            </div>
          </div>
          
          <div styleName="main">
            {!!this.payPlan &&
              <div styleName="payplan-info">
                <p>You are subscribing to "{this.payPlan.name}" pay plan ({this.isYearly ? 'yearly' : 'monthly'} subscription). </p>
                <p>Price: ${this.isYearly ? this.payPlan.priceYearly : this.payPlan.priceMonthly}</p>
              </div>
            }
            
            {this.state.method ?
              <div styleName="method-content">
                <div styleName="label">Payment method:</div>
                <div styleName="method-name">
                  {this.state.method.brand} xxxx-{this.state.method.last4}
                </div>
                <div styleName="checkbox-wrapper">
                  <CheckboxControl title="Use payment method as default"
                                   checked={this.state.saveMethod}
                                   disabled={this.state.pending}
                                   onChange={this.onSaveMethodCheck} />
                </div>
                <div styleName="button-wrapper">
                  <ButtonControl color="red"
                                 onClick={this.onRemoveMethod}
                                 disabled={this.state.pending}
                                 showLoader={this.state.pendingRemove}
                                 value="Remove method" />
                </div>
                <div styleName="button-wrapper">
                  <ButtonControl color="green"
                                 onClick={this.onSubscribe}
                                 disabled={this.state.pending}
                                 showLoader={this.state.pendingSubscribe}
                                 value="Subscribe" />
                </div>
              </div>
            :
              <div styleName="method-content">
                <Elements>
                  <PayElement onStart={() => this.setState({pending: true})}
                              onComplete={this.onNewSourceSubscribe}
                              disabled={this.state.pending}
                              canBeDefault={methods && methods.length} />
                </Elements>
              </div>
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
    userActions: bindActionCreators({updateUser}, dispatch),
    navActions: bindActionCreators({showAlert}, dispatch),
    payActions: bindActionCreators({addSource, removeSource, updateSubscription}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentMethods);
