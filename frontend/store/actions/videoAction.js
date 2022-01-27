import types from "../types";

export const setVideo = (devices) => (
  {
    type: types.SET_VIDEO,
    devices,
  }
);

export const setCamera = (cameraId) => (
  {
    type: types.SET_CAMERA,
    cameraId,
  }
);

export const setMic = (micId) => (
  {
    type: types.SET_MIC,
    micId,
  }
);

export const setSpeaker = (speakerId) => (
  {
    type: types.SET_SPEAKER,
    speakerId,
  }
);