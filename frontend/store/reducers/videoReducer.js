import types from "../types";

const initialState = {
  camera: null,
  mic: null,
  speaker: null,
};

const videoReducer = (state=initialState, action) => {
  switch (action.type) {
    case types.SET_VIDEO:
      return {...state, ...action.devices};
    default:
      return state;
  }
}

export default videoReducer;