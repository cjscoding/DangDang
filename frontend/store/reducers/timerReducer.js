import types from "../types";

const timerState = {
  startTIme: + new Date(),
  curTime: + new Date()
};

const timerReducer = (state = timerState, action) => {
  switch (action.type) {
    case types.START_TIMER:
      return { ...state, startTIme: + new Date() };
    case types.TIMER_TICK:
      return { ...state, curTime: + new Date() };
    default:
      return state;
  }
};

export default timerReducer;