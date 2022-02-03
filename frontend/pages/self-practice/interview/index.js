import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import styles from "../../../scss/self-practice/interview/mainComponent.module.scss";

function mapStateToProps(state) {
  return {
    ws: state.wsReducer.ws,
    questions: state.questionReducer.questions,
    cameraId: state.videoReducer.cameraId, 
    micId: state.videoReducer.micId,
    speakerId: state.videoReducer.speakerId,
  };
}
export default connect(mapStateToProps)(Interview);

function Interview({ws, questions, cameraId, micId, speakerId}) {
  const router = useRouter();
  const myFaceContainer = useRef();
  const [isWait, setIsWait] = useState(true);
  const [screenNum, setScreenNum] = useState(3);
  const [questionNum, setQuestionNum] = useState(0);
  const [volume, setVolume] = useState(30);
  const [isVol, setIsVol] = useState(false);
  const volumeBtn = useRef();
  const restartBtn = useRef();
  const saveBtn = useRef();
  const skipBtn = useRef();

  useEffect(()=>{
    let questionNum2 = 0;

    let webRtcPeer;
    const myFace = document.createElement("video");
    myFace.autoplay = true;
    myFace.controls = false;
    myFace.playsInline = true;
    myFace.width = "100%";
    myFace.height = "100%";
    myFaceContainer.current.appendChild(myFace);
    function sendMessage(msgObj) {
      const msgStr = JSON.stringify(msgObj);
      console.log(`SEND: ${msgStr}`)
      ws.send(msgStr);
    }
    ws.onmessage = function(message) {
      const msgObj = JSON.parse(message.data);
      console.log(`RECEIVE: ${message.data}`)
      switch(msgObj.id) {
        case "startResponse":
          responseRecord(msgObj);
          break;
        default:
          console.log(`ERROR! ${msgObj}`)
      }
    }
    
    function record() {
      hideScreen();
      const options = {
        remoteVideo: myFace,
        mediaConstraints : getVideoConstraints(),
        onicecandidate : onIceCandidate
      }
      webRtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(options, function(error) {
        if (error) return console.log(`ERROR! ${error}`);
        webRtcPeer.generateOffer(onOffer);
      });
    }
    function onOffer(error, offerSdp) {
      if(error) return console.log(`ERROR! ${error}`);
      sendMessage({
        id: "start",
        sdpOffer: offerSdp,
        mode: "video-and-audio"
      });
    }

    function responseRecord(msgObj) {
      webRtcPeer.processAnswer(msgObj.sdpAnswer, function(error) {
        if (error) return console.log(`ERROR! ${error}`)
      });
    }

    function save() {
      
    }
    // function play() {
    //   hideScreen();
    //   const options = {
    //     remoteVideo: myFace,
    //     mediaConstraints : getVideoConstraints(),
    //     onicecandidate : onIceCandidate
    //   }
    //   webRtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(options, function(error) {
    //     if (error) return console.log(`ERROR! ${error}`);
    //     webRtcPeer.generateOffer(onPlayOffer);
    //   });
    // }
    // function onPlayOffer(error, offerSdp) {
    //   if(error) return console.log(`ERROR! ${error}`)
    //   sendMessage({
    //     id: "play",
    //     sdpOffer: offerSdp,
    //     path: ?
    //   });
    // }

    function getVideoConstraints() {
      const initialConstraints = { width: 320, height: 180, facingMode: "user" }
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

    function onIceCandidate(candidate) {
      sendMessage({
        id: "onIceCandidate",
        candidate: candidate
      });
    }

    function hideScreen() {
      setIsWait(true);
    }

    function showScreen(){
      setIsWait(false);
    }

    function controlVolume() {
      setIsVol(true)
    }
    function restartQuestion() {
      
    }
    function saveAndNext() {
      if(questionNum2 === questions.length - 1) {
        router.push(`/self-practice/interview/end`);
      }
      questionNum2 += 1
      setQuestionNum(questionNum2)
    }
    function skipQuestion() {
      if(questionNum2 === questions.length - 1) {
        router.push(`/self-practice/interview/end`);
      }
      questionNum2 += 1
      setQuestionNum(questionNum2)
    }
    volumeBtn.current.addEventListener("click", controlVolume);
    restartBtn.current.addEventListener("click", restartQuestion);
    saveBtn.current.addEventListener("click", saveAndNext);
    skipBtn.current.addEventListener("click", skipQuestion);
    return () => {
      volumeBtn.current.removeEventListener("click", controlVolume);
      restartBtn.current.removeEventListener("click", restartQuestion);
      saveBtn.current.removeEventListener("click", saveAndNext);
      skipBtn.current.removeEventListener("click", skipQuestion);
    }
  },[])
  console.log(1, questionNum)
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
      <div style={isWait||screenNum!==1?{display: "none"}:{}} className={styles.video1}>{questions[questionNum]}</div>
      <div style={isWait||screenNum!==2?{display: "none"}:{}} className={styles.video2} ref={myFaceContainer}></div>
      <div style={isWait||screenNum!==3?{display: "none"}:{}} className={styles.video3}>면접관 얼굴 나올 예정(아래 버튼으로 화면 바꾸셈)</div>
      <div style={!isWait?{display: "none"}:{}} className={styles.video4}>화면 기다리는 중</div>
      <div className={styles.changeBtn}>
        <span onClick={() => setScreenNum(1)}>●</span>
        <span onClick={() => setScreenNum(2)}>●</span>
        <span onClick={() => setScreenNum(3)}>●</span>
      </div>
      <div className={styles.btnContainer}>
        <span>
          <i ref={volumeBtn} className="fas fa-volume-up"></i>
          <input style={isVol?{}:{display: "none"}} type="range" min="0" max="100" step="1" value={volume} onChange={(e) => setVolume(e.target.value)}/>
        </span>
        <i ref={restartBtn} class="fas fa-redo-alt"></i>
        <i ref={saveBtn} class="fas fa-save"></i>
        <i ref={skipBtn} class="fas fa-arrow-right"></i>
      </div>
    </div>
  </div>
</div>
}