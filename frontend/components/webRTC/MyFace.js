import { useEffect, useRef } from "react";
import { connect } from "react-redux";
import getVideoConstraints from "./getVideoConstraints";

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
    async function getMedia() {
      try {
        stream = await navigator.mediaDevices.getUserMedia(
          getVideoConstraints(1280, 720)
        );
        video.current.srcObject = stream;
      }catch(err) {
        console.log(err);
      }
    }
    if(speakerId) {
      getMedia();
      video.current.setSinkId(speakerId);
    }
  },[cameraId, micId, speakerId])

  return <video ref={video} autoPlay playsInline width={"100%"} height={"100%"} />
}