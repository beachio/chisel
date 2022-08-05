import {Parse} from 'parse';

import {config} from 'utils/initialize';
import {PayPlanData} from 'models/PayPlanData';
import {send, getAllObjects, CLOUD_ERROR_CODE__STRIPE_INIT_ERROR, PARSE_ERROR_CODE__CLOUD_FAIL} from 'utils/server';


export const SET_STRIPE_PROMISE     = 'app/pay/SET_STRIPE_PROMISE';
export const INIT_END               = 'app/pay/INIT_END';
export const ADD_SOURCE             = 'app/pay/ADD_SOURCE';
export const REMOVE_SOURCE          = 'app/pay/REMOVE_SOURCE';
export const UPDATE_SUBSCRIPTION    = 'app/pay/UPDATE_SUBSCRIPTION';
export const UPDATE_DEFAULT_SOURCE  = 'app/pay/UPDATE_DEFAULT_SOURCE';


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

export function setStripePromise(stripePromise) {
  return {
    type: SET_STRIPE_PROMISE,
    stripePromise
  };
}

export function init() {
  return async dispatch => {
    const payPlans = await requestPayPlans();

    try {
      const stripeData = await requestStripeData();
      const unpaidSub = stripeData.subscription && stripeData.subscription.status == 'past_due';

      dispatch({
        type: INIT_END,
        payPlans,
        stripeData,
        unpaidSub
      });

    } catch (error) {
      const stripeInitError = error.code == PARSE_ERROR_CODE__CLOUD_FAIL &&
          error.message && error.message.errorCode == CLOUD_ERROR_CODE__STRIPE_INIT_ERROR;

      dispatch({
        type: INIT_END,
        payPlans,
        stripeInitError
      });
    }
  };
}

export function addSource(source, isDefault) {
  return {
    type: ADD_SOURCE,
    source,
    isDefault
  };
}

export function removeSource(source) {
  return {
    type: REMOVE_SOURCE,
    source
  };
}

export function updateSubscription(subscription, payPlan) {
  return {
    type: UPDATE_SUBSCRIPTION,
    subscription,
    payPlan
  };
}

export function updateDefaultSource(sourceId) {
  return {
    type: UPDATE_DEFAULT_SOURCE,
    sourceId
  };
}


const initialState = {
  stripePromise: null,
  payPlans: [],
  stripeData: {},
  stripeInitError: false
};

export default function payReducer(state = initialState, action) {
  const {stripeData} = state;
  const sources = stripeData.sources ? stripeData.sources : [];
  
  switch (action.type) {
    case SET_STRIPE_PROMISE:
      return {
        ...state,
        stripePromise: action.stripePromise
      };

    case INIT_END:
      return {
        ...state,
        payPlans: action.payPlans,
        stripeData: action.stripeData ? action.stripeData : {},
        stripeInitError: !!action.stripeInitError || !config.stripeKeyExists
      };
  
    case ADD_SOURCE:
      sources.push(action.source);
      stripeData.sources = sources;
      if (action.isDefault)
        stripeData.defaultSource = action.source.id;
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
  
    case UPDATE_DEFAULT_SOURCE:
      stripeData.defaultSource = action.sourceId;
      return {
        ...state,
        stripeData
      };
      
    default:
      return state;
  }
}
