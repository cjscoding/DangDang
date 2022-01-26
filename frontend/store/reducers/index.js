import { HYDRATE } from "next-redux-wrapper";
import { combineReducers } from "redux";
import roomReducer from "./roomReducer";
import videoReducer from "./videoReducer";
import questionReducer from "./questionReducer";
import userReducer from "./userReducer";

const combinedReducer = combineReducers({
  roomReducer,
  videoReducer,
  questionReducer,
  userReducer,
});

const reducer = (state, action) => {
  if (action.type === HYDRATE) {
    return { ...state, ...action.payload };
  } else {
    return combinedReducer(state, action);
  }
};

export default reducer;
