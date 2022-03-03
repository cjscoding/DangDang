import types from "../types";

const initialState = {
  cameraId: null,
  micId: null,
  speakerId: null,
};

const videoReducer = (state=initialState, action) => {
  switch (action.type) {
    case types.SET_VIDEO:
      return {...state, ...action.devices};
    case types.SET_CAMERA:
      return {...state, cameraId: action.cameraId}
    case types.SET_MIC:
      return {...state, micId: action.micId}
    case types.SET_SPEAKER:
      return {...state, speakerId: action.speakerId}
    default:
      return state;
  }
}

export default videoReducer;