import { useEffect, useRef } from "react";
import { connect } from "react-redux";

function mapStateToProps(state) {
  return {
    cameraId: state.videoReducer.cameraId, 
    micId: state.videoReducer.micId,
    speakerId: state.videoReducer.speakerId
  };
}
export default connect(mapStateToProps)(MyFace);

function MyFace({cameraId, micId, speakerId}) {
  const video = useRef();
  useEffect(() => {
    let stream;
    async function getMedia(cameraId, micId) {
      const initialConstraints = { width: 1280, height: 720, facingMode: "user" };
      const cameraConstraints = {video: {...initialConstraints, deviceId: {exact: cameraId}}};
      const micConstraints = {audio: {deviceId: {exact: micId}}};
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          ...micId?micConstraints:{},
          video: initialConstraints,
          ...cameraId?cameraConstraints:{},
        });
        video.current.srcObject = stream;
      }catch(err) {
        console.log(err);
      }
    }
    if(speakerId) {
      getMedia(cameraId, micId);
      video.current.setSinkId(speakerId);
    }
  },[cameraId, micId, speakerId])

  return <video ref={video} autoPlay playsInline width={"100%"} height={"100%"} />
}