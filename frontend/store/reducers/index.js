import { HYDRATE } from "next-redux-wrapper";
import { combineReducers } from "redux";
import roomReducer from "./roomReducer";
import videoReducer from "./videoReducer"
import questionReducer from "./questionReducer";

const combinedReducer = combineReducers({
  roomReducer,
  videoReducer,
  questionReducer,
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