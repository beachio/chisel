import {Parse} from 'parse';

import {PayPlanData} from 'models/PayPlanData';
import {send, getAllObjects} from 'utils/server';


export const INIT_END             = 'app/pay/INIT_END';
export const ADD_SOURCE           = 'app/pay/ADD_SOURCE';
export const REMOVE_SOURCE        = 'app/pay/REMOVE_SOURCE';
export const UPDATE_SUBSCRIPTION  = 'app/pay/UPDATE_SUBSCRIPTION';


async function requestPayPlans() {
  const payPlans_o = await send(getAllObjects(
    new Parse.Query(PayPlanData.OriginClass)
  ));
  const payPlans = [];
  for (let payPlan_o of payPlans_o) {
    const payPlan = new PayPlanData().setOrigin(payPlan_o);
    payPlans.push(payPlan);
  }
  
  return payPlans;
}

async function requestStripeData() {
  return await send(
    Parse.Cloud.run('getStripeData')
  );
}

export function init() {
  return async dispatch => {
    let payPlans = await requestPayPlans();
    if (!payPlans || !payPlans.length)
      payPlans = [new PayPlanData()];
    
    const stripeData = await requestStripeData();
    
    dispatch({
      type: INIT_END,
      payPlans,
      stripeData
    });
  };
}

export function addSource(source, isDefault) {
  return {
    type: ADD_SOURCE,
    source,
    isDefault
  }
}

export function removeSource(source) {
  return {
    type: REMOVE_SOURCE,
    source
  }
}

export function updateSubscription(subscription) {
  return {
    type: UPDATE_SUBSCRIPTION,
    subscription
  }
}


const initialState = {
  payPlans: [],
  stripeData: {}
};

export default function payReducer(state = initialState, action) {
  const {stripeData} = state;
  const sources = stripeData.sources ? stripeData.sources : [];
  
  switch (action.type) {
    case INIT_END:
      return {
        ...state,
        payPlans: action.payPlans,
        stripeData: action.stripeData ? action.stripeData : {}
      };
  
    case ADD_SOURCE:
      sources.push(action.source);
      if (action.isDefault)
        stripeData.defaultSource = source;
      return {
        ...state,
        stripeData
      };
      
    case REMOVE_SOURCE:
      let ind = sources.indexOf(action.source);
      if (ind != -1)
        sources.splice(ind, 1);
      return {
        ...state,
        stripeData
      };
  
    case UPDATE_SUBSCRIPTION:
      stripeData.subscription = action.subscription;
      return {
        ...state,
        stripeData
      };
      
    default:
      return state;
  }
}
