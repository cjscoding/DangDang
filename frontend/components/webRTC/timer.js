import { store } from "../../store";
import { startTimer, timerTick } from "../../store/actions/timerAction";

export default {
  timerTick: null,
  tickFunction: () => setInterval(()=>store.dispatch(timerTick()), 1000),
  startTimer: function() {
    this.stopTimer();
    store.dispatch(startTimer());
    this.timerTick = this.tickFunction()
  },
  stopTimer: function() {
    clearInterval(this.timerTick);
  },
}