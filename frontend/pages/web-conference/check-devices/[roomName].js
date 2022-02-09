import Link from "next/link";
import { useEffect } from "react";
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
  const router = useRouter()
  useEffect(() => {
    window.addEventListener("beforeunload", ()=>{
      ws.close();
    });
  }, [])
  return <div className={styles.container}>
      <div className={styles.videoContainer}>
        <div><MyFace /></div>
        <div className={styles.selectContainer}>
          <label htmlFor="camera-select">카메라</label><br/>
          <CameraSelect id="camera-select" /><br/>
          <label htmlFor="mic-select">마이크</label><br/>
          <MicSelect id="mic-select" /><br/>
          <label htmlFor="speaker-select">스피커</label><br/>
          <SpeakerSelect id="speaker-select" /><br/>
        </div>
        <Link href={`/web-conference/${router.query.roomName}`}>
          <a className={styles.nextBtn}
          >
            <button><h1>NEXT</h1></button>
          </a>
        </Link>
      </div>
    </div>
}