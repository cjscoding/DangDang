import types from "../types";

export const setVideo = (devices) => (
  {
    type: types.SET_VIDEO,
    devices,
  }
);