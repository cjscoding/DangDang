import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import MyFace from "../../../components/webRTC/MyFace";
import ShowQuestion from "../../../components/webRTC/self-practice/ShowQuestion";
import styles from "../../../scss/self-practice/interview/mainComponent.module.scss";

function mapStateToProps(state) {
  return {
    ws: state.wsReducer.ws,
    sessionId: state.wsReducer.sessionId,
    questions: state.questionReducer.questions,
    cameraId: state.videoReducer.cameraId, 
    micId: state.videoReducer.micId,
    speakerId: state.videoReducer.speakerId,
  };
}
import { setWSSessionId, pushRecordedQuestionIdx, setSelectedQuestion } from "../../../store/actions/wsAction";
function mapDispatchToProps(dispatch) {
  return {
    setWSSessionId: (sessionId) => dispatch(setWSSessionId(sessionId)),
    pushRecordedQuestionIdx: (idx) => dispatch(pushRecordedQuestionIdx(idx)),
    setSelectedQuestion: (selectedQuestion) => dispatch(setSelectedQuestion(selectedQuestion)),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Interview);

function Interview({ws, sessionId, questions, cameraId, micId, speakerId, setWSSessionId, pushRecordedQuestionIdx, setSelectedQuestion}) {
  const router = useRouter();
  const myFaceContainer = useRef();
  const [isWait, setIsWait] = useState(false);
  const [screenNum, setScreenNum] = useState(3);
  const [questionNum, setQuestionNum] = useState(0);
  const [volume, setVolume] = useState(30);
  const [isVol, setIsVol] = useState(false);
  const volumeBtn = useRef();
  const restartBtn = useRef();
  const saveBtn = useRef();
  const skipBtn = useRef();

  useEffect(()=>{
    setSelectedQuestion(questions[0])
    let questionNum2 = 0;

    let webRtcPeer;
    const myFace = document.querySelector("#my-face");
    // myFace.autoplay = true;
    // myFace.controls = false;
    // myFace.playsInline = true;
    // myFace.width = "100%";
    // myFace.height = "100%";
    async function getStream() {
      const stream = await navigator.mediaDevices.getUserMedia(getVideoConstraints());
      myFace.srcObject = stream
      // myFaceContainer.current.appendChild(myFace);
    }
    getStream();
    function sendMessage(msgObj) {
      const msgStr = JSON.stringify(msgObj);
      console.log(`SEND: ${msgStr}`);
      ws.send(msgStr);
    }
    ws.onmessage = function(message) {
      const msgObj = JSON.parse(message.data);
      console.log(`RECEIVE: ${message.data}`);
      switch(msgObj.id) {
        case "startResponse":
          if(!sessionId) setWSSessionId(msgObj.sessionId);
          webRtcPeer.processAnswer(msgObj.sdpAnswer, function(error) {
            if (error) return console.log(`ERROR! ${error}`);
          });
          break;
        case "iceCandidate":
          webRtcPeer.addIceCandidate(msgObj.candidate, function(error) {
            if(error) return console.log(`ERROR! ${error}`);
          })
        case "stopped":
          break;
        case "paused":
          break;
        case "recording":
          break;
        default:
          console.log(`ERROR! ${msgObj}`);
          break;
      }
    }
    
    function record() {
      // hideScreen();
      const options = {
        localVideo: myFace,
        mediaConstraints : getVideoConstraints(),
        onicecandidate : onIceCandidate
      }
      webRtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(options, function(error) {
        if (error) return console.log(`ERROR! ${error}`);
        webRtcPeer.generateOffer(onOffer);
      });
    }
    function onOffer(error, offerSdp) {
      if(error) return console.log(`ERROR! ${error}`);
      sendMessage({
        id: "start",
        sdpOffer: offerSdp,
        mode: "video-and-audio",
        name: questionNum2
      });
    }

    function save() {
      if(webRtcPeer) {
        webRtcPeer.dispose();
        webRtcPeer = null;
        sendMessage({
          id: "stop"
        });
      }
    }

    function del() {
      sendMessage({
        id: "del",
        name: questionNum2
      });
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
        candidate : candidate
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
      record()
      return false;
    }
    function saveAndNext() {
      save();
      pushRecordedQuestionIdx(questionNum2);
      if(questionNum2 === questions.length - 1) {
        router.push(`/self-practice/interview/end`);
      }
      questionNum2 += 1
      // setQuestionNum(questionNum2)
      setSelectedQuestion(questions[questionNum2])
      record();
      return false;
    }
    function skipQuestion() {
      if(questionNum2 === questions.length - 1) {
        router.push(`/self-practice/interview/end`);
      }
      questionNum2 += 1
      // setQuestionNum(questionNum2)
      setSelectedQuestion(questions[questionNum2])
      record();
      return false;
    }
    volumeBtn.current.addEventListener("click", controlVolume);
    restartBtn.current.addEventListener("click", restartQuestion);
    saveBtn.current.addEventListener("click", saveAndNext);
    skipBtn.current.addEventListener("click", skipQuestion);
    window.onbeforeunload = function() {
      sendMessage({
        id : 'del',
      });
      ws.close();
    }
    record();
    return () => {
      // volumeBtn.current.removeEventListener("click", controlVolume);
      // restartBtn.current.removeEventListener("click", restartQuestion);
      // saveBtn.current.removeEventListener("click", saveAndNext);
      // skipBtn.current.removeEventListener("click", skipQuestion);
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
      <div style={isWait||screenNum!==1?{display: "none"}:{}} className={styles.video1}><ShowQuestion /></div>
      <div style={isWait||screenNum!==2?{display: "none"}:{}} className={styles.video2}><video height={"360px"} width={"480px"} autoPlay id="my-face"></video></div>
      <div style={isWait||screenNum!==3?{display: "none"}:{}} className={styles.video3}>면접관 얼굴 나올 예정(아래 버튼으로 화면 바꾸셈)</div>
      <div style={!isWait?{display: "none"}:{}} className={styles.video4}>화면 기다리는 중</div>
      <div className={styles.changeBtn}>
        <span onClick={() => setScreenNum(1)}>●</span>
        <span onClick={() => setScreenNum(2)}>●</span>
        <span onClick={() => setScreenNum(3)}>●</span>
      </div>
      <div className={styles.btnContainer}>
        <span>
          <button ref={volumeBtn}><i className="fas fa-volume-up"></i></button>
          <input style={isVol?{}:{display: "none"}} type="range" min="0" max="100" step="1" value={volume} onChange={(e) => setVolume(e.target.value)}/>
        </span>
        <button ref={restartBtn}><i className="fas fa-redo-alt"></i></button>
        <button ref={saveBtn}><i className="fas fa-save"></i></button>
        <button ref={skipBtn}><i className="fas fa-arrow-right"></i></button>
      </div>
    </div>
  </div>
</div>
}