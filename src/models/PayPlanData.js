import {Parse} from 'parse';


export class PayPlanData {
  static get OriginClass() {return Parse.Object.extend("PayPlan");}
  
  origin = null;
  
  name = '';
  limitSites = 0;
  priceMonthly = 0;
  priceYearly = 0;
  
  isDefault = true;
  
  
  setOrigin(origin) {
    this.origin = origin;
    
    if (origin.get('name'))         this.name         = origin.get('name');
    if (origin.get('limitSites'))   this.limitSites   = origin.get('limitSites');
    if (origin.get('priceMonthly')) this.priceMonthly = origin.get('priceMonthly');
    if (origin.get('priceYearly'))  this.priceYearly  = origin.get('priceYearly');
    
    this.isDefault = !this.priceMonthly && !this.priceYearly;
    
    return this;
  }
}
