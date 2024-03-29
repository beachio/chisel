import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import {CardElement, ElementsConsumer, Elements} from '@stripe/react-stripe-js';
import {Parse} from 'parse';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import {Helmet} from "react-helmet-async";

import ButtonControl from "components/elements/ButtonControl/ButtonControl";
import CheckboxControl from "components/elements/CheckboxControl/CheckboxControl";
import IconsComponent from 'components/elements/IconsComponent/IconsComponent';
import ContainerComponent from 'components/elements/ContainerComponent/ContainerComponent';
import InputControl from "components/elements/InputControl/InputControl";
import DropdownControl from "components/elements/DropdownControl/DropdownControl";
import {ALERT_TYPE_ALERT, ALERT_TYPE_CONFIRM} from "components/modals/AlertModal/AlertModal";
import {send} from 'utils/server';
import {showAlert, returnHome} from "ducks/nav";
import {addSource, removeSource, updateSubscription, updateDefaultSource} from 'ducks/pay';
import {getPayPlan, getPayMethod} from "utils/data";
import {withRouter} from 'utils/routing';


import styles from './PaymentMethods.sss';


const countries = {
  "Australia": "AU",
  "Austria": "AT",
  "Belgium": "BE",
  "Brazil": "BR",
  "Canada": "CA",
  "China": "CN",
  "Denmark": "DK",
  "Finland": "FI",
  "France": "FR",
  "Germany": "DE",
  "Hong Kong": "HK",
  "Ireland": "IE",
  "Italy": "IT",
  "Japan": "JP",
  "Luxembourg": "LU",
  "Mexico": "MX",
  "Netherlands": "NL",
  "New Zealand": "NZ",
  "Norway": "NO",
  "Portugal": "PT",
  "Singapore": "SG",
  "Spain": "ES",
  "Sweden": "SE",
  "Switzerland": "CH",
  "United Kingdom": "GB",
  "United States": "US"
};


@CSSModules(styles, {allowMultiple: true})
class _PayCardElement extends Component {
  state = {
    name: this.props.userName,
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',

    defaultMethod: true,
    errorRequired: false,
    error: null,
    complete: false
  };


  submit = async e => {
    e.preventDefault();
    
    if (!this.state.complete)
      return;

    if (!this.state.name ||
        !this.state.address ||
        !this.state.city ||
        (!this.state.state && this.country == "United States") ||
        !this.state.zip) {
      this.setState({errorRequired: true});
      return;
    }

    const {onStart, onComplete, onError, stripe, elements} = this.props;
    
    onStart();

    const cardElement = elements.getElement(CardElement);
    const {token, error} = await stripe.createToken(cardElement, {
      name:           this.state.name,
      address_line1:  this.state.address,
      address_city:   this.state.city,
      address_state:  this.state.state,
      address_zip:    this.state.zip,
      address_country:countries[this.state.country]
    });
    if (error)
      onError(error);
    else if (token)
      onComplete(token, this.state.defaultMethod);
  };
  
  onDefaultMethodCheck = checked => {
    this.setState({defaultMethod: checked});
  };

  onChangeName = name => {
    this.setState({name, errorRequired: false});
  };

  onChangeAddress = address => {
    this.setState({address, errorRequired: false});
  };

  onChangeCity = city => {
    this.setState({city, errorRequired: false});
  };

  onChangeState = state => {
    this.setState({state, errorRequired: false});
  };

  onChangeZip = zip => {
    this.setState({zip, errorRequired: false});
  };

  onChangeCountry = country => {
    this.setState({country, errorRequired: false});
  };

  onChangeCard = change => {
    this.setState({complete: change.complete});
    if (change.error)
      this.setState({error: change.error.message});
    else
      this.setState({error: null});
  };
  
  render() {
    const style = {
      base: {
        fontSize: '14px',
        color: '#313133',
        fontFamily: "Source Code Pro, monospace",
        '::placeholder': {
          fontFamily: "Open Sans, sans-serif",
          color: '#999999',
        }
      },
      invalid: {
        color: '#9e2146'
      }
    };
    
    const {payPlan, canBeDefault} = this.props;
    
    return (
      <form onSubmit={this.submit} styleName="form">
        <section styleName="section">
          <div styleName="section-header">Billing address</div>
          <div styleName="input-wrapper">
            <InputControl placeholder="Name"
                          autoFocus
                          value={this.state.name}
                          onChange={this.onChangeName} />
          </div>
          <div styleName="input-wrapper">
            <InputControl placeholder="Address"
                          value={this.state.address}
                          onChange={this.onChangeAddress} />
          </div>
          <div styleName="inputs-inline">
            <div styleName="input-wrapper">
              <InputControl placeholder="City"
                            value={this.state.city}
                            onChange={this.onChangeCity} />
            </div>
            {this.state.country == "United States" &&
              <div styleName="input-wrapper input-state">
                <InputControl placeholder="State"
                              value={this.state.state}
                              onChange={this.onChangeState}/>
              </div>
            }
            <div styleName="input-wrapper input-zip">
              <InputControl placeholder={this.state.country == "United States" ? "ZIP" : "Postal code"}
                            value={this.state.zip}
                            onChange={this.onChangeZip} />
            </div>
          </div>
          <div styleName="input-wrapper">
            <DropdownControl label="Country"
                             inline
                             current={this.state.country}
                             list={Object.keys(countries)}
                             onSuggest={this.onChangeCountry} />
          </div>
        </section>

        <section styleName="section">
          <div styleName="section-header">Card details</div>
          <div styleName="card-wrapper">
            <CardElement onChange={this.onChangeCard}
                         options={{style,  hidePostalCode: true}} />
          </div>
        </section>

        {canBeDefault &&
          <div styleName="checkbox-wrapper">
            <CheckboxControl title="Use the payment method as a default"
                             checked={this.state.defaultMethod}
                             onChange={this.onDefaultMethodCheck} />
          </div>
        }
        <div styleName="button-wrapper">
          <ButtonControl color="purple"
                         type="submit"
                         disabled={!this.state.complete || this.state.errorRequired}
                         value={payPlan ? "Subscribe" : "Add Method"} />
        </div>
        {this.state.error &&
          <div styleName="error">{this.state.error}</div>
        }
        {this.state.errorRequired &&
          <div styleName="error">All fields are required to fill!</div>
        }
      </form>
    );
  }
}

export const PayCardElement = (props) => (
  <ElementsConsumer>
    {({stripe, elements}) => (
      <_PayCardElement stripe={stripe} elements={elements} {...props} />
    )}
  </ElementsConsumer>
);


@CSSModules(styles, {allowMultiple: true})
class PaymentMethods extends Component {
  state = {
    method: null,
    pending: false,
    defaultMethod: true
  };
  
  methods = [];
  payPlan = null;
  isYearly = false;
  
  
  constructor(props) {
    super(props);

    const {location} = props.router;
    if (location) {
      const searchParams = new URLSearchParams(location.search);
      const plan = searchParams.get("plan");
      if (plan)
        this.payPlan = getPayPlan(plan);
      this.isYearly = searchParams.get("yearly") == 'true';
    }
  
    const {stripeData} = props.pay;
    if (stripeData)
      this.state.method = getPayMethod(stripeData.defaultSource);
  }

  /*
  setupPaymentRequestButton = async () => {
    this.paymentRequest = this.props.stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: {
        label: 'Demo total',
        amount: 1000,
      }
    });

    this.paymentRequest.on('token', async ({complete, token, ...data}) => {
      await this.onNewSourceSubscribe(token, true);

      complete('success');
    });

    const canMakePaymentRequest = !!(await this.paymentRequest.canMakePayment());
    this.setState({canMakePaymentRequest});
  };
  */

  onError = error => {
    const {showAlert} = this.props.navActions;
    showAlert({
      type: ALERT_TYPE_ALERT,
      title: "Payment method data error",
      description: error.message
    });
    this.setState({pending: false});
  };
  
  onNewSourceSubscribe = async (token, asDefault) => {
    const {userData} = this.props.user;
    const {addSource, updateSubscription} = this.props.payActions;
    const {showAlert, returnHome} = this.props.navActions;

    let StripeId;

    try {
      this.setState({pending: true});
      StripeId = await send(
        Parse.Cloud.run('savePaymentSource', {tokenId: token.id, asDefault})
      );
    } catch (error) {
      showAlert({
        type: ALERT_TYPE_ALERT,
        title: "Payment method data error",
        description: error.message
      });
      this.setState({pending: false});
      return;
    }

    if (!this.payPlan) {
      // StripeId is null if user already have one
      if (StripeId)
        userData.StripeId = StripeId;
      addSource(token.card, asDefault);
      this.setState({method: token.card, pending: false});
      return;
    }

    try {
      const subscription = await send(
        Parse.Cloud.run('paySubscription', {
          planId: this.payPlan.origin.id,
          isYearly: this.isYearly
        })
      );

      // StripeId is null if user already have one
      if (StripeId)
        userData.StripeId = StripeId;

      addSource(token.card, asDefault);
      updateSubscription(subscription, this.payPlan);

      showAlert({
        type: ALERT_TYPE_ALERT,
        title: "Payment complete",
        description: `You are successfully subscribed to ${this.payPlan.name}.`,
        callback: returnHome
      });

    } catch (error) {
      showAlert({
        type: ALERT_TYPE_ALERT,
        title: "Payment isn't complete",
        description: error.message
      });

    } finally {
      this.setState({pending: false});
    }
  };
  
  onSubscribe = async () => {
    const {updateSubscription} = this.props.payActions;
    const {showAlert, returnHome} = this.props.navActions;
    
    try {
      this.setState({pending: true});
      const subscription = await send(
        Parse.Cloud.run('paySubscription', {
          planId: this.payPlan.origin.id,
          isYearly: this.isYearly
        })
      );
      updateSubscription(subscription, this.payPlan);
  
      showAlert({
        type: ALERT_TYPE_ALERT,
        title: "Payment complete",
        description: `You are successfully change your subscription to ${this.payPlan.name}.`,
        callback: returnHome
      });
      
    } catch (e) {
      console.log(e);
      
    } finally {
      this.setState({pending: false});
    }
  };
  
  onRemoveMethod = async () => {
    const {showAlert} = this.props.navActions;
    const {updateDefaultSource} = this.props.payActions;

    let description = "Are you sure?";
    if (this.methods.length <= 1)
      description = `Caution! You are going to remove the last payment method. If you will not add a new one, we can't continue your subscription to the next payment period. Are you sure?`;

    showAlert({
      type: ALERT_TYPE_CONFIRM,
      title: `Deleting <strong>${this.state.method.brand} xxxx-${this.state.method.last4}</strong>`,
      description,
      onConfirm: async () => {
        const {removeSource} = this.props.payActions;
  
        try {
          this.setState({pending: true});
          const res = await send(
            Parse.Cloud.run('removePaymentSource', {sourceId: this.state.method.id})
          );
          removeSource(this.state.method);
          if (res)
            updateDefaultSource(res.defaultSource);
          
          const methods = this.props.pay.stripeData.sources;
          this.setState({method: methods[0]});
        } catch (e) {
        } finally {
          this.setState({pending: false});
        }
      }
    });
  };
  
  onSetDefaultMethod = async () => {
    try {
      const {updateDefaultSource} = this.props.payActions;
      
      this.setState({pending: true});
      await send(
        Parse.Cloud.run('setDefaultPaymentSource', {sourceId: this.state.method.id})
      );
      updateDefaultSource(this.state.method.id);
    
    } catch (e) {
    } finally {
      this.setState({pending: false});
    }
  };
  
  onCheckDefaultMethod = checked => {
    this.setState({defaultMethod: checked});
  };
  
  onMethodClick = method => {
    this.setState({method, defaultMethod: true});
  };
  
  render() {
    const {stripePromise, stripeData} = this.props.pay;
    let defaultMethod = null;
    if (stripeData) {
      this.methods = stripeData.sources;
      defaultMethod = stripeData.defaultSource;
    }
    
    let newMethodStyle = "method method-new";
    if (!this.state.method)
      newMethodStyle += " method-checked";
    
    let setAsDefaultElm = <div>This is a default method.</div>;
    if (this.state.method && this.state.method.id != defaultMethod) {
      if (this.payPlan) {
        setAsDefaultElm = (
          <div styleName="checkbox-wrapper">
            <CheckboxControl title="Use the payment method as a default"
                             checked={this.state.defaultMethod}
                             onChange={this.onCheckDefaultMethod}/>
          </div>);
      } else {
        setAsDefaultElm = (
          <div styleName="button-wrapper">
            <ButtonControl onClick={this.onSetDefaultMethod}
                           value="Set this method as default"/>
          </div>
        );
      }
    }
    
    return <>
      <Helmet>
        <title>Payment methods - Chisel</title>
      </Helmet>
    
      <ContainerComponent title="Payment methods"
                          showLoader={this.state.pending} >
        <div styleName="content">
          <div styleName="side">
            {this.methods &&
              this.methods.map(method => {
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
                Add Payment Method
              </div>
              <div styleName="icon-plus">
                <IconsComponent icon="plus" />
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
                
                {setAsDefaultElm}
                
                <div styleName="button-wrapper">
                  <ButtonControl onClick={this.onRemoveMethod}
                                 value="Remove this method" />
                </div>
                {!!this.payPlan &&
                  <div styleName="button-wrapper">
                    <ButtonControl onClick={this.onSubscribe}
                                   value={"Subscribe"}/>
                  </div>
                }
              </div>
            :
              <div styleName="method-content">
                <Elements stripe={stripePromise}>
                  <PayCardElement onStart={() => this.setState({pending: true})}
                                  onComplete={this.onNewSourceSubscribe}
                                  onError={this.onError}
                                  payPlan={this.payPlan}
                                  userName={this.props.user.userData.fullName}
                                  canBeDefault={!!this.methods && !!this.methods.length} />
                </Elements>

              </div>
            }
          </div>
        </div>
      </ContainerComponent>
    </>;
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
    payActions: bindActionCreators({addSource, removeSource, updateSubscription, updateDefaultSource}, dispatch)
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PaymentMethods));
