import {Parse} from 'parse';

import {store} from 'index';
import {PayPlanData} from 'models/PayPlanData';
import {send, getAllObjects} from 'utils/server';


export const INIT_END = 'app/pay/INIT_END';


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

export function init() {
  return async dispatch => {
    let payPlans = await requestPayPlans();
    if (!payPlans || !payPlans.length)
      payPlans = [new PayPlanData()];
    
    dispatch({
      type: INIT_END,
      payPlans
    });
  };
}


const initialState = {
  payPlans: []
};

export default function payReducer(state = initialState, action) {
  switch (action.type) {
    case INIT_END:
      return {
        ...state,
        payPlans: action.payPlans
      };
    
    default:
      return state;
  }
}
