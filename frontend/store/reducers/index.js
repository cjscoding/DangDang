import { HYDRATE } from "next-redux-wrapper";
import { combineReducers } from "redux";
import roomReducer from "./postReducer";
import videoReducer from "./videoReducer"

const combinedReducer = combineReducers({
  roomReducer,
  videoReducer,
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