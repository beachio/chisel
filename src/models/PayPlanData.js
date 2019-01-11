import {Parse} from 'parse';


export class PayPlanData {
  static get OriginClass() {return Parse.Object.extend("PayPlan");}
  
  origin = null;
  
  name = '';
  limitSites = 0;
  priceMonthly = 0;
  priceYearly = 0;
  StripeIdMonthly = '';
  StripeIdYearly = '';
  
  isDefault = true;
  
  
  setOrigin(origin) {
    this.origin = origin;
    
    if (origin.get('name'))             this.name             = origin.get('name');
    if (origin.get('limitSites'))       this.limitSites       = origin.get('limitSites');
    if (origin.get('priceMonthly'))     this.priceMonthly     = origin.get('priceMonthly');
    if (origin.get('priceYearly'))      this.priceYearly      = origin.get('priceYearly');
    if (origin.get('StripeIdMonthly'))  this.StripeIdMonthly  = origin.get('StripeIdMonthly');
    if (origin.get('StripeIdYearly'))   this.StripeIdYearly   = origin.get('StripeIdYearly');
    
    this.isDefault = !this.priceMonthly && !this.priceYearly;
    
    return this;
  }
  
  greaterThan(payPlan) {
    return this.priceMonthly > payPlan.priceMonthly;
  }
}
