import Link from "next/link";
import { useEffect, useRef } from "react";
import { connect } from "react-redux";
import styles from "../../../scss/self-practice/interview/mainComponent.module.scss";

function mapStateToProps(state) {
  return {
    cameraId:state.videoReducer.camera, 
    micId: state.videoReducer.mic,
    speakerId: state.videoReducer.speaker
  };
}
export default connect(mapStateToProps)(Interview);

function Interview({cameraId, micId, speakerId}) {
  const video = useRef();
  useEffect(() => {
    let stream;
    async function getMedia() {
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
        video.current.setSinkId(speakerId);
      }catch(err) {
        console.log(err);
      }
    }
    getMedia();
  },[])

  return <div>
  <div className={styles.closeBtnBox}>
    <Link href="/self-practice/interview/end">
      <a>
        <button className={styles.closeBtn}>종료</button>
      </a>
    </Link>
  </div>
  <div className={styles.container}>
    <div className={styles.videoContainer}>
      <video ref={video} autoPlay playsInline />
      <div className={styles.changeBtn}>
        <span>●</span>
        <span>●</span>
        <span>●</span>
      </div>
      <div className={styles.btnContainer}>
        <button>버튼</button>
        <button>버튼</button>
        <button>버튼</button>
        <button>버튼</button>
      </div>
    </div>
  </div>
</div>
}