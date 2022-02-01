import types from "../types";

const initialState = {
  ws: null,
};

const wsReducer = (state=initialState, action) => {
  switch (action.type) {
    case types.CONNECT_SOCKET:
      return {...state, ws: action.ws};
    default:
      return state;
  }
}

export default wsReducer;