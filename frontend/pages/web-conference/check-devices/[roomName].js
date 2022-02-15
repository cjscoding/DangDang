import { useEffect, useRef } from "react";
import { connect } from "react-redux";
import CameraSelect from "../../../components/webRTC/devices/CameraSelect";
import MicSelect from "../../../components/webRTC/devices/MicSelect";
import SpeakerSelect from "../../../components/webRTC/devices/SpeakerSelect";
import MyFace from "../../../components/webRTC/MyFace";
import styles from "../../../scss/web-conference/check-devices.module.scss";
import SockJS from "sockjs-client";
import { WEBRTC_URL } from "../../../config";

function mapStateToProps(state) {
  return {
    ws: state.wsReducer.ws,
  };
}
import { connectSocket } from "../../../store/actions/wsAction";
import { useRouter } from "next/router";
function mapDispatchToProps(dispatch) {
  const ws = new SockJS(`${WEBRTC_URL}/groupcall`);
  dispatch(connectSocket(ws))
  return {};
}
export default connect(mapStateToProps, mapDispatchToProps)(CheckDevices);

function CheckDevices({ws}) {
  const nextBtn = useRef();
  const router = useRouter()
  useEffect(() => {
    function beforeunload() {
      ws.close()
    }
    window.addEventListener("beforeunload", beforeunload);
    return () => {
      window.removeEventListener("beforeunload", beforeunload);
    }
  }, [])
  useEffect(()=>{
    function goToConference() {
      router.push(`/web-conference/${router.query.roomName}`);
    }
    const nextBtnEl = nextBtn.current
    nextBtnEl.addEventListener("click", goToConference)
    return () => {
      nextBtnEl.removeEventListener("click", goToConference)
    }
  }, [router])

  return <div className={styles.body}>
      <span className={styles.title}>카메라와 마이크 설정을 확인해주세요.</span>
      <div className={styles.videoContainer}>
        <div><MyFace /></div>
        <div className={styles.selectContainer}>
          <div>
            <label htmlFor="camera-select"></label><br/>
            <span className={styles.span}><i className="fas fa-camera"></i></span>
            <CameraSelect id="camera-select"/><br/>
          </div>
          <div>
            <label htmlFor="mic-select"></label><br/>
            <span className={styles.span}><i className={`fas fa-microphone`}></i></span>
            <MicSelect id="mic-select" /><br/>
          </div>
          <div>
            <label htmlFor="speaker-select"></label><br/>
            <span className={styles.span}><i className="fas fa-headphones"></i></span>
            <SpeakerSelect id="speaker-select" /><br/>
          </div>
        </div>
        <button ref={nextBtn} className={styles.nextBtn}>입장하기!</button>
      </div>
    </div>
}