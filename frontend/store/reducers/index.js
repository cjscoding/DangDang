import { HYDRATE } from "next-redux-wrapper";
import { combineReducers } from "redux";
import roomReducer from "./postReducer";

const combinedReducer = combineReducers({
  roomReducer,
});

const reducer = (state = { tick: "init" }, action) => {
  if (action.type === HYDRATE) {
    const nextState = { ...state, ...action.payload };
    if (state.count) nextState.count = state.count;
    return nextState;
  } else {
    return combinedReducer(state, action);
  }
};

export default reducer;