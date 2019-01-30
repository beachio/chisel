import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import {CardElement, injectStripe, Elements} from 'react-stripe-elements';
import {Parse} from 'parse';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import {Helmet} from "react-helmet";
import {browserHistory} from "react-router";

import ButtonControl from "components/elements/ButtonControl/ButtonControl";
import CheckboxControl from "components/elements/CheckboxControl/CheckboxControl";
import IconsComponent from 'components/elements/IconsComponent/IconsComponent';
import ContainerComponent from 'components/elements/ContainerComponent/ContainerComponent';
import InputControl from "components/elements/InputControl/InputControl";
import DropdownControl from "components/elements/DropdownControl/DropdownControl";
import {ALERT_TYPE_ALERT, ALERT_TYPE_CONFIRM} from "components/modals/AlertModal/AlertModal";
import {send} from 'utils/server';
import {update as updateUser} from "ducks/user";
import {showAlert, URL_USERSPACE} from "ducks/nav";
import {addSource, removeSource, updateSubscription, updateDefaultSource} from 'ducks/pay';
import {getPayPlan, getPayMethod} from "utils/data";


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
class _PayElement extends Component {
  state = {
    name: '',
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

  constructor(props) {
    super(props);

    this.state.name = props.userName;
  }
  
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

    const {onStart, onComplete} = this.props;
    
    onStart();
    const {token} = await this.props.stripe.createToken({
      name:           this.state.name,
      address_line1:  this.state.address,
      address_city:   this.state.city,
      address_state:  this.state.state,
      address_zip:    this.state.zip,
      address_country:countries[this.state.country]
    });
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
          Billing address
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
          Card details
          <div styleName="card-wrapper">
            <CardElement style={style} onChange={this.onChangeCard} hidePostalCode />
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
                         value={payPlan ? "Subscribe" : "Add method"} />
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

export const PayElement = injectStripe(_PayElement);


@CSSModules(styles, {allowMultiple: true})
class PaymentMethods extends Component {
  state = {
    method: null,
    pending: false,
    defaultMethod: true
  };
  
  payPlan = null;
  isYearly = false;
  
  
  constructor(props) {
    super(props);
    
    if (props.location && props.location.query) {
      if (props.location.query.plan)
        this.payPlan = getPayPlan(props.location.query.plan);
      this.isYearly = props.location.query.yearly == 'true';
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
  
  onNewSourceSubscribe = async (token, asDefault) => {
    const {userData} = this.props.user;
    const {updateUser} = this.props.userActions;
    const {addSource, updateSubscription, updateDefaultSource} = this.props.payActions;
    const {showAlert} = this.props.navActions;

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
      if (StripeId) {
        userData.StripeId = StripeId;
        updateUser(userData);
      }
      addSource(token.card);
      if (asDefault)
        updateDefaultSource(token.card.id);

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

      if (StripeId) {
        userData.StripeId = StripeId;
        updateUser(userData);
      }
      addSource(token.card);
      if (asDefault)
        updateDefaultSource(token.card.id);

      updateSubscription(subscription, this.payPlan);

      showAlert({
        type: ALERT_TYPE_ALERT,
        title: "Payment complete",
        description: `You are successfully subscribed to ${this.payPlan.name}.`,
        callback: () => browserHistory.push(`/${URL_USERSPACE}`)
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
    const {showAlert} = this.props.navActions;
    
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
        callback: () => browserHistory.push(`/${URL_USERSPACE}`)
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
    showAlert({
      type: ALERT_TYPE_CONFIRM,
      title: `Deleting <strong>${this.state.method.brand} xxxx-${this.state.method.last4}</strong>`,
      description: "Are you sure?",
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
    const {stripeData} = this.props.pay;
    let methods = [];
    let defaultMethod = null;
    if (stripeData) {
      methods = stripeData.sources;
      defaultMethod = stripeData.defaultSource;
    }
    
    let newMethodStyle = "method method-new";
    if (!this.state.method)
      newMethodStyle += " method-checked";
    
    let setAsDefaultElm = <div>This is default method.</div>;
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
                           value="Set method as default"/>
          </div>
        );
      }
    }
    
    return [
      <Helmet key="helmet">
        <title>Payment methods - Chisel</title>
      </Helmet>,
    
      <ContainerComponent key="content"
                          title="Payment methods"
                          showLoader={this.state.pending} >
        <div styleName="content">
          <div styleName="side">
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
                                 value="Remove method" />
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
                <Elements>
                  <PayElement onStart={() => this.setState({pending: true})}
                              onComplete={this.onNewSourceSubscribe}
                              payPlan={this.payPlan}
                              userName={this.props.user.userData.fullName}
                              canBeDefault={!!methods && !!methods.length} />
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
    payActions: bindActionCreators({addSource, removeSource, updateSubscription, updateDefaultSource}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentMethods);
