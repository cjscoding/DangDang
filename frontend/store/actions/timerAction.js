import types from "../types";

export const startTimer = () => ({
  type: types.START_TIMER,
});

export const timerTick = () => ({
  type: types.TIMER_TICK,
});