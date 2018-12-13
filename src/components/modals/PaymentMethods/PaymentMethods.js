import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import {CardElement, injectStripe, Elements} from 'react-stripe-elements';
import {Parse} from 'parse';

import ButtonControl from "components/elements/ButtonControl/ButtonControl";
import CheckboxControl from "components/elements/CheckboxControl/CheckboxControl";
import {send} from 'utils/server';

import styles from './PaymentMethods.sss';


@CSSModules(styles, {allowMultiple: true})
class _PayElement extends Component {
  state = {
    saveMethod: true
  };
  
  submit = async (e) => {
    e.preventDefault();
    
    const {token} = await this.props.stripe.createToken({name: "Card 1"});
  
    if (this.state.saveMethod) {
      try {
        const paymentMethod = await send(
          Parse.Cloud.run('savePaymentInfo', {tokenId: token.id, card: token.card})
        );
        
        this.props.onComplete();
      } catch (e) {
      }
      
    } else {
      try {
        await send(
          Parse.Cloud.run('payOnce', {tokenId: token.id})
        );
        this.props.onComplete();
      } catch (e) {
      }
    }
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
                           onChange={this.onSaveMethodCheck} />
        </div>
        <div styleName="button-wrapper">
          <ButtonControl color="green"
                         type="submit"
                         value="Subscribe" />
        </div>
      </form>
    );
  }
}

export const PayElement = injectStripe(_PayElement);


@CSSModules(styles, {allowMultiple: true})
export default class PaymentMethods extends Component {
  state = {
    method: null
  };
  
  active = false;
  
  
  constructor(props) {
    super(props);
    
    const {paymentInfo} = props.userData;
    if (paymentInfo && paymentInfo.length)
      this.state.method = paymentInfo[paymentInfo.length - 1];
  }
  
  componentDidMount() {
    this.active = true;
  }
  
  onComplete = () => {
  
  };
  
  submit = async (e) => {
    e.preventDefault();
    
    try {
      await send(
        Parse.Cloud.run('pay', {methodId: this.state.method.id})
      );
      this.onComplete();
    } catch (e) {
    }
  };
  
  onMethodClick = method => {
    this.setState({method});
  };
  
  close = () => {
    this.active = false;
    this.props.onClose();
  };
  
  render() {
    const {payPlan} = this.props.params;
    const {paymentInfo} = this.props.userData;
    
    let newMethodStyle = "method method-new";
    if (!this.state.method)
      newMethodStyle += " method-checked";
    
    return (
      <div styleName="modal" onClick={this.close}>
        <div styleName="modal-inner" onClick={e => e.stopPropagation()}>
          <div styleName="modal-header">
            <div styleName="title">Choosing payment method</div>
          </div>
          
          <div styleName="content">
            <div styleName="side">
              <div styleName="title">
                Your payment methods
              </div>
              {paymentInfo &&
                paymentInfo.map(method => {
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
              <div styleName="payplan-info">
                <p>You are subscribing to "{payPlan.name}". </p>
                <p>Price: ${payPlan.priceMonthly}</p>
              </div>
              
              {this.state.method ?
                <div styleName="method-content">
                  <div styleName="label">Payment method:</div>
                  <div styleName="method-name">
                    {this.state.method.brand} xxxx-{this.state.method.last4}
                  </div>
                  <div styleName="button-wrapper">
                    <ButtonControl color="green"
                                   onClick={this.submit}
                                   value="Subscribe" />
                  </div>
                </div>
              :
                <div styleName="method-content">
                  <Elements>
                    <PayElement onComplete={this.onComplete}/>
                  </Elements>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
