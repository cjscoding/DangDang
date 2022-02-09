import types from "../types";

const timerState = {
  seconds: 0,
};

const timerReducer = (state = timerState, action) => {
  switch (action.type) {
    case types.START_TIMER:
      return { ...state, seconds: 0 };
    case types.TIMER_TICK:
      return { ...state, seconds: state.seconds + 1 };
    default:
      return state;
  }
};

export default timerReducer;