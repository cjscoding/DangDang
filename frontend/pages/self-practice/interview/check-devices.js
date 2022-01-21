import Link from "next/link";
import { useEffect, useRef } from "react"
import { connect } from "react-redux";
import styles from "../../../scss/self-practice/interview/check-devices.module.scss";

// export async function getServerSideProps() {
  //   const questions = [
    //     "안녕하세요",
    //     "점심 맛있게 드셨어요?",
    //     "다음에 봬요!"
    //   ]
    //   return {props: {questions}};
    // };
    import {wrapper} from '../../../store';
    export const getServerSideProps = wrapper.getServerSideProps(store => {
      console.log(store.getState())
    });
    function mapStateToProps(state) {
      return {
        isQs: state.questionReducer.questions.length !== 0
      };
    }
import { setQuestions } from "../../../store/actions/questionAction";
import { setVideo } from "../../../store/actions/videoAction";
function mapDispatchToProps(dispatch) {
  return {
    selectDevice: (devices) => dispatch(setVideo(devices)),
    setQuestions: (questions) => dispatch(setQuestions(questions))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(CheckDevices);

function CheckDevices({questions, isQs, selectDevice, setQuestions}) {
  useEffect(() => {
    if(!isQs) {
      // setQuestions(questions);
    }
  }, [])

  const video = useRef(); // 화면 송출
  const cameraSelect = useRef();
  const micSelect = useRef();
  const speakerSelect = useRef();
  
  useEffect(() => {
    let stream;
    async function getDevices() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();        
        const currentCamera = stream.getVideoTracks()[0];
        const currentMic = stream.getAudioTracks()[0];
        let currentSpeaker;
        devices.forEach(device => {
          const option = document.createElement("option");
          option.value = device.deviceId;
          option.innerText = device.label;
          switch (device.kind) {
            case "videoinput":
              if (currentCamera.label === device.label) option.selected = true;
              cameraSelect.current.appendChild(option);
              break;
            case "audioinput":
              if (currentMic.label === device.label) option.selected = true;
              micSelect.current.appendChild(option);
              break;
            case "audiooutput":
              if(!currentSpeaker) {
                currentSpeaker = device;
                option.selected = true;
              }
              speakerSelect.current.appendChild(option);
              break;
            default:
              break;
          }
        });
      }catch(err) {
        console.log(err);
      }
    }

    async function getMedia(cameraId, micId) {
      const initialConstraints = { width: 1280, height: 720, facingMode: "user" };
      const cameraConstraints = {video: {...initialConstraints, deviceId: {exact: cameraSelect.current.value}}};
      const micConstraints = {audio: {deviceId: {exact: micSelect.current.value}}};
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          ...micId?micConstraints:{},
          video: initialConstraints,
          ...cameraId?cameraConstraints:{},
        });
        video.current.srcObject = stream;
        if(!cameraId && !micId) await getDevices();
      }catch(err) {
        console.log(err);
      }
    }
    
    cameraSelect.current.addEventListener("input", () => getMedia(cameraSelect.current.value, micSelect.current.value));
    micSelect.current.addEventListener("input", () => getMedia(cameraSelect.current.value, micSelect.current.value));
    speakerSelect.current.addEventListener("input", () => video.current.setSinkId(speakerSelect.current.value));
    getMedia();
  }, [])
  
  const setDevices = () => {
    const devices = {
      camera: cameraSelect.current.value,
      mic: micSelect.current.value,
      speaker: speakerSelect.current.value,
    };
    selectDevice(devices);
  }
  return <div className={styles.container}>
    <div className={styles.videoContainer}>
      <video ref={video} autoPlay playsInline />
      <div className={styles.selectContainer}>
        <label htmlFor="camera-select">카메라</label><br/>
        <select ref={cameraSelect} id="camera-select" /><br/>
        <label htmlFor="mic-select">마이크</label><br/>
        <select ref={micSelect} id="mic-select" /><br/>
        <label htmlFor="speaker-select">스피커</label><br/>
        <select ref={speakerSelect} id="speaker-select" /><br/>
      </div>
      <Link href="/self-practice/interview">
        <a className={styles.nextBtn}
          onClick={setDevices}
        >
          <button><h1>NEXT</h1></button>
        </a>
      </Link>
    </div>
  </div>
}