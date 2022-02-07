import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import MyFace from "../../../components/webRTC/MyFace";
import ShowQuestion from "../../../components/webRTC/self-practice/ShowQuestion";
import styles from "../../../scss/self-practice/interview/mainComponent.module.scss";
import axios from "axios";
import timer from "../../../components/webRTC/timer"

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
import { setWSSessionId, pushRecordedQuestionIdx, setSelectedQuestion, setQuestionToggleState } from "../../../store/actions/wsAction";

function mapDispatchToProps(dispatch) {
  return {
    setWSSessionId: (sessionId) => dispatch(setWSSessionId(sessionId)),
    pushRecordedQuestionIdx: (idx) => dispatch(pushRecordedQuestionIdx(idx)),
    setSelectedQuestion: (selectedQuestion) => dispatch(setSelectedQuestion(selectedQuestion)),
    setQuestionToggleState: () => dispatch(setQuestionToggleState()),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Interview);

function Interview({ws, sessionId, questions, cameraId, micId, speakerId, setWSSessionId, pushRecordedQuestionIdx, setSelectedQuestion, setQuestionToggleState}) {
  const router = useRouter();
  const [isWait, setIsWait] = useState(false);
  const [screenNum, setScreenNum] = useState(3);
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
    myFace.autoplay = true;
    myFace.playsInline = true;
    myFace.style.width = "100%";
    myFace.style.height = "100%";
    async function getStream() {
      const stream = await navigator.mediaDevices.getUserMedia(getVideoConstraints());
      myFace.srcObject = stream
    }
    getStream();
    function sendMessage(msgObj) {
      const msgStr = JSON.stringify(msgObj);
      // console.log(`SEND: ${msgStr}`);
      ws.send(msgStr);
    }
    ws.onmessage = function(message) {
      const msgObj = JSON.parse(message.data);
      // console.log(`RECEIVE: ${message.data}`);
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
          break;
        default:
          console.log(`ERROR! ${msgObj}`);
          break;
      }
    }
    
    function record() {
      // setQuestionToggleState()
      timer.startTimer()
      let txt=questions[questionNum2];
      axios({
        method:"post",
        url:"https://kakaoi-newtone-openapi.kakao.com/v1/synthesize",
        headers:{
            "Content-Type":"application/xml",
            "Authorization": "KakaoAK c420902bf013e6a215efef159a46af41",
        },
        data:"<speak><voice name='MAN_READ_CALM'>"+txt+"</voice></speak>",
        responseType: 'arraybuffer',
      }).then((res)=>{
        // arraybuffer를 재생하는 코드 
        const context=new AudioContext();
        context.decodeAudioData(res.data,buffer=>{
          const source = context.createBufferSource();
          source.buffer = buffer;
          source.connect(context.destination);
          source.start(0);
        });
      }).catch((error)=>{
          console.log(error);
      })
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

    function getVideoConstraints() {
      const initialConstraints = { width: 640, height: 360, facingMode: "user" }
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
      return;
    }
    function saveAndNext() {
      save();
      pushRecordedQuestionIdx(questionNum2);
      if(questionNum2 === questions.length - 1) {
        router.push(`/self-practice/interview/end`);
        return;
      }
      questionNum2 += 1
      setSelectedQuestion(questions[questionNum2])
      record();
      return;
    }
    function skipQuestion() {
      if(questionNum2 === questions.length - 1) {
        router.push(`/self-practice/interview/end`);
        return;
      }
      questionNum2 += 1
      setSelectedQuestion(questions[questionNum2])
      record();
      return;
    }
    // return 함수에서 .current를 사용하면 에러가 남
    const volumeButton = volumeBtn.current;
    const restartButton = restartBtn.current;
    const saveButton = saveBtn.current;
    const skipButton = skipBtn.current;
    volumeButton.addEventListener("click", controlVolume);
    restartButton.addEventListener("click", restartQuestion);
    saveButton.addEventListener("click", saveAndNext);
    skipButton.addEventListener("click", skipQuestion);
    record();
    return () => {
      timer.stopTimer()
      volumeButton.removeEventListener("click", controlVolume);
      restartButton.removeEventListener("click", restartQuestion);
      saveButton.removeEventListener("click", saveAndNext);
      skipButton.removeEventListener("click", skipQuestion);
    }
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
      <div style={isWait||screenNum!==1?{display: "none"}:{}} className={styles.video1}><ShowQuestion /></div>
      <div style={isWait||screenNum!==2?{display: "none"}:{}} className={styles.video2}><video id="my-face"></video></div>
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