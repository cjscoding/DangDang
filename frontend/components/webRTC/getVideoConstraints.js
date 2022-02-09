import { store } from "../../store";

export default function getVideoConstraints(width, height) {
  const cameraId = store.getState().videoReducer.cameraId
  const micId = store.getState().videoReducer.micId

  const initialConstraints = { width, height, facingMode: "user" }
  const cameraConstraints = {video: {...initialConstraints, deviceId: {exact: cameraId}}}
  const micConstraints = {audio: {deviceId: {exact: micId}}}

  const constraints = {
    audio: true,
    ...micId?micConstraints:{},
    video: initialConstraints,
    ...cameraId?cameraConstraints:{},
  }
  return constraints;
}
