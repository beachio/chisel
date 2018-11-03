import {store} from 'index';


export const LOG_REQUEST    = 'app/serverStatus/LOG_REQUEST';
export const LOG_RESPONSE   = 'app/serverStatus/LOG_RESPONSE';
export const SET_PROBLEM_B  = 'app/serverStatus/SET_PROBLEM_B';
export const TIMER_TICK     = 'app/serverStatus/TIMER_TICK';


let timer = 0;

const TIME_A = 7 * 1000;
const TIME_B = 30 * 1000;


export function logRequest (time) {
  if (!timer)
    timer = setInterval(() => store.dispatch(timerTick()), 1000);

  return {
    type: LOG_REQUEST,
    time
  };
}

export function logResponse (time) {
  const req = store.getState().serverStatus.requests;
  if (!req.length || req.length == 1 && req[0] == time) {
    clearInterval(timer);
    timer = 0;
  }

  return {
    type: LOG_RESPONSE,
    time
  };
}

export function setProblemB () {
  clearInterval(timer);
  timer = 0;

  return {
    type: SET_PROBLEM_B
  };
}

function timerTick () {
  return {
    type: TIMER_TICK,
    time: Date.now()
  };
}


const initialState = {
  requests: [],
  problemA: false,
  problemB: false
};

export default function serverStatusReducer(state = initialState, action) {
  let requests = state.requests.slice();

  switch (action.type) {
    case LOG_REQUEST:
      requests.push(action.time);
      return {
        ...state,
        problemB: false,
        requests
      };

    case LOG_RESPONSE:
      requests.splice(requests.indexOf(action.time), 1);
      if (requests.length)
        return {
          ...state,
          requests
        };
      else
        return {
          ...state,
          requests,
          problemA: false,
          problemB: false
        };

    case TIMER_TICK:
      const problemA = action.time - requests[0] > TIME_A;
      const problemB = action.time - requests[0] > TIME_B;
      if (problemB)
        requests = [];
      return {
        ...state,
        problemA,
        problemB,
        requests
      };

    case SET_PROBLEM_B:
      return {
        ...state,
        requests: [],
        problemB: true
      };

    default:
      return state;
  }
}