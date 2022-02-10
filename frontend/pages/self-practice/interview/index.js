import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import ShowQuestion from "../../../components/webRTC/self-practice/ShowQuestion";
import styles from "../../../scss/self-practice/interview/mainComponent.module.scss";
import timer from "../../../components/webRTC/timer"
import getVideoConstraints from "../../../components/webRTC/getVideoConstraints";
import { ttsService } from "../../../api/webRTC";

function mapStateToProps(state) {
  return {
    ws: state.wsReducer.ws,
    sessionId: state.wsReducer.sessionId,
    questions: state.questionReducer.questions,
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

function Interview({ws, sessionId, questions, setWSSessionId, pushRecordedQuestionIdx, setSelectedQuestion}) {
  const router = useRouter();
  const [isWait, setIsWait] = useState(true);
  const [screenNum, setScreenNum] = useState(3);
  // const [volume, setVolume] = useState(30);
  const [isVol, setIsVol] = useState(false);
  const volumeBtn = useRef();
  const restartBtn = useRef();
  const saveBtn = useRef();
  const skipBtn = useRef();
  const volumeBar = useRef();

  useEffect(()=>{
    if(!ws) window.location.href = "/self-practice/interview/select-questionlist";

    setSelectedQuestion(questions[0])
    let questionNumState = 0; // useEffect에서 사용할 questionNum 상태(useEffect안에서는 questionNum이 바뀌지 않음)

    let webRtcPeer;
    const myFace = document.querySelector("#my-face");
    myFace.autoplay = true;
    myFace.playsInline = true;
    myFace.style.width = "100%";
    myFace.style.height = "100%";
    async function getStream() {
      const stream = await navigator.mediaDevices.getUserMedia(getVideoConstraints(1280, 720));
      myFace.srcObject = stream
    }
    getStream();

    function sendMessage(msgObj) {
      const msgStr = JSON.stringify(msgObj);
      ws.send(msgStr);
    }
    ws.onmessage = function(message) {
      const msgObj = JSON.parse(message.data);
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
          break;
        case "stopped":
          break;
        case "paused":
          break;
        case "recording":
          showScreen()
          timer.startTimer();
          ttsService(questions[questionNumState], volume);
          break;
        default:
          console.log(`ERROR! ${msgObj}`);
          break;
      }
    }
    
    function record() {
      hideScreen();

      const options = {
        localVideo: myFace,
        mediaConstraints : getVideoConstraints(640, 360),
        onicecandidate : onIceCandidate
      }
      webRtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(options, function(error) {
        if (error) return console.log(`ERROR! ${error}`);
        webRtcPeer.generateOffer(onOffer);
      });
    }
    function onIceCandidate(candidate) {
      sendMessage({
        id: "onIceCandidate",
        candidate : candidate
      });
    }
    function onOffer(error, offerSdp) {
      if(error) return console.log(`ERROR! ${error}`);
      sendMessage({
        id: "start",
        sdpOffer: offerSdp,
        mode: "video-and-audio",
        name: questionNumState
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


    function hideScreen() {
      setIsWait(true);
    }
    function showScreen(){
      setIsWait(false);
    }

    let isVolState = isVol
    function controlVolume() {
      isVolState = !isVolState
      setIsVol(isVolState)
    }
    function restartQuestion() {
      record()
      return;
    }
    function saveAndNext() {
      save();
      pushRecordedQuestionIdx(questionNumState);
      if(questionNumState === questions.length - 1) {
        router.push(`/self-practice/interview/end`);
        return;
      }
      questionNumState += 1
      setSelectedQuestion(questions[questionNumState])
      record();
      return;
    }
    function skipQuestion() {
      if(questionNumState === questions.length - 1) {
        router.push(`/self-practice/interview/end`);
        return;
      }
      questionNumState += 1
      setSelectedQuestion(questions[questionNumState])
      record();
      return;
    }
    function setVolume(e) {
      volume = e.target.value
    }
    // return 함수에서 .current를 사용하면 에러가 남
    const volumeButton = volumeBtn.current;
    const restartButton = restartBtn.current;
    const saveButton = saveBtn.current;
    const skipButton = skipBtn.current;
    const volVar = volumeBar.current
    let volume = 50;
    volVar.value = volume
    volumeButton.addEventListener("click", controlVolume);
    restartButton.addEventListener("click", restartQuestion);
    saveButton.addEventListener("click", saveAndNext);
    skipButton.addEventListener("click", skipQuestion);
    volVar.addEventListener("change", setVolume);
    record();

    return () => {
      timer.stopTimer()
      volumeButton.removeEventListener("click", controlVolume);
      restartButton.removeEventListener("click", restartQuestion);
      saveButton.removeEventListener("click", saveAndNext);
      skipButton.removeEventListener("click", skipQuestion);
      volVar.removeEventListener("change", setVolume);
    }
  },[])
  return <div>
  <div className={styles.closeBtnBox}>
    <Link href="/self-practice/interview/end">
      <a>
        <button className={styles.closeBtn}><i className="fas fa-time"></i></button>
      </a>
    </Link>
  </div>
  <div className={styles.container}>
    <div className={styles.interviewContainer}>
      <div className={styles.top}>
        <div className={styles.selectContainer}>
          <div className={styles.changeBtn}>
            <span onClick={() => setScreenNum(1)} className={styles.tooltip}><i className="fas fa-question"></i><span>질문 다시 보기</span></span>
            <span onClick={() => setScreenNum(2)} className={styles.tooltip}><i className="fas fa-eye"></i><span>내 얼굴 보기</span></span>
            <span onClick={() => setScreenNum(3)} className={styles.tooltip}><i className="fas fa-user"></i><span>면접관 얼굴 보기</span></span>
          </div>
        </div>
        <div className={styles.videoContainer}>
          <div className={styles.video}>
            <div style={isWait||screenNum!==1?{display: "none"}:{}} className={styles.video1}><ShowQuestion /></div>
            <div style={isWait||screenNum!==2?{display: "none"}:{}} className={styles.video2}><video id="my-face"></video></div>
            <div style={isWait||screenNum!==3?{display: "none"}:{}} className={styles.video3}><img src="/images/누칼협.jpg" height={"100%"}/></div>
            <div style={!isWait?{display: "none"}:{}} className={styles.video4}><img src="/images/loading.gif" height={"100%"}/></div>
          </div>
        </div>
       </div>
       <div className={styles.btnContainer}>
        <span>
          <span ref={volumeBtn}><i className="fas fa-volume-up"></i></span>
          <input style={isVol?{}:{display: "none"}} type="range" min="0" max="100" step="1" ref={volumeBar}/>
        </span>
        <span ref={restartBtn}><i className="fas fa-redo-alt"></i></span>
        <span ref={saveBtn}><i className="fas fa-save"></i></span>
        <span ref={skipBtn}><i className="fas fa-arrow-right"></i></span>
      </div>
    </div>
  </div>
</div>
}