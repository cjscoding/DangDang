import { useEffect, useRef, useState } from "react";
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
import { getMyRooms } from "../../../api/studyroom";
function mapDispatchToProps(dispatch) {
  const ws = new SockJS(`${WEBRTC_URL}/groupcall`);
  dispatch(connectSocket(ws))
  return {};
}
export default connect(mapStateToProps, mapDispatchToProps)(CheckDevices);

function CheckDevices({ws}) {
  const nextBtn = useRef();
  const router = useRouter()
  const [rooms, setRooms] = useState([])
  const [roomNum, setRoomNum] = useState()
  if(router.query.roomName && router.query.roomName !== roomNum) {
    setRoomNum(router.query.roomName)
  }
  useEffect(() => {
    if(rooms.length !== 0 && roomNum) {
      if(!rooms.some(room => String(room.id) === roomNum)) {
        alert("가입한 스터디 채널이 아닙니다.")
        router.push("/404")
      }
    }
  }, [rooms, roomNum])
  useEffect(() => {
    function beforeunload() {
      ws.close()
    }
    window.addEventListener("beforeunload", beforeunload);
    const param = {
      page: 0,
      size: 9999,
    };
    getMyRooms(
      param,
      (res) => {
        setRooms(res.data.response.content)
      },
      () => {
        alert("로그인 이후에 이용하실 수 있습니다.")
        router.push("/404")
      }
    );

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
          <div className={styles.select}>
            <label htmlFor="camera-select">
              <i className="fas fa-camera"></i>
            </label>
            <CameraSelect id="camera-select"/>
          </div>
          <div className={styles.select}>
            <label htmlFor="mic-select">
              <i className={`fas fa-microphone`}></i>
            </label>
            <MicSelect id="mic-select" />
          </div>
          <div className={styles.select}>
            <label htmlFor="speaker-select">
              <i className="fas fa-headphones"></i>
            </label>
            <SpeakerSelect id="speaker-select" />
          </div>
        </div>
        <button ref={nextBtn} className={styles.nextBtn}>입장하기!</button>
      </div>
    </div>
}