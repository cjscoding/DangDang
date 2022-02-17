import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import ShowQuestion from "../../../components/webRTC/self-practice/ShowQuestion";
import styles from "../../../scss/self-practice/interview/mainComponent.module.scss";
import timer from "../../../components/webRTC/timerfunction";
import Timer from "../../../components/webRTC/Timer";
import getVideoConstraints from "../../../components/webRTC/getVideoConstraints";
import { ttsService } from "../../../api/webRTC";
import Title from "../../../components/layout/Title";

function mapStateToProps(state) {
  const questions = state.questionReducer.questions.map(
    (question) => question.question
  );
  return {
    wsSocket: state.wsReducer.ws,
    sessionId: state.wsReducer.sessionId,
    questions,
  };
}
import {
  setWSSessionId,
  pushRecordedQuestionIdx,
  setSelectedQuestion,
} from "../../../store/actions/wsAction";
function mapDispatchToProps(dispatch) {
  return {
    setWSSessionId: (sessionId) => dispatch(setWSSessionId(sessionId)),
    pushRecordedQuestionIdx: (idx) => dispatch(pushRecordedQuestionIdx(idx)),
    setSelectedQuestion: (selectedQuestion) =>
      dispatch(setSelectedQuestion(selectedQuestion)),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Interview);

function Interview({
  wsSocket,
  sessionId,
  questions,
  setWSSessionId,
  pushRecordedQuestionIdx,
  setSelectedQuestion,
}) {
  const router = useRouter();
  const [isWait, setIsWait] = useState(true);
  const [screenNum, setScreenNum] = useState(3);
  // const [volume, setVolume] = useState(30);
  const [isVol, setIsVol] = useState(false);

  const [videoNum, setVideoNum] = useState(0);

  const volumeBtn = useRef();
  const restartBtn = useRef();
  const saveBtn = useRef();
  const skipBtn = useRef();
  const volumeBar = useRef();

  useEffect(() => {
    let ws = wsSocket;
    if (!ws) {
      alert("잘못된 접근입니다.");
      ws = {};
      ws.send = function () {};
      ws.close = function () {};
      window.location.href = "/404";
      // router.push("/404")
    }

    setVideoNum(+new Date() % 3);

    setSelectedQuestion(questions[0]);
    let questionNumState = 0; // useEffect에서 사용할 questionNum 상태(useEffect안에서는 questionNum이 바뀌지 않음)

    let webRtcPeer;
    const myFace = document.querySelector("#my-face");
    myFace.autoplay = true;
    myFace.playsInline = true;
    myFace.style.width = "100%";
    myFace.style.height = "100%";
    async function getStream() {
      const stream = await navigator.mediaDevices.getUserMedia(
        getVideoConstraints(1280, 720)
      );
      myFace.srcObject = stream;
    }
    getStream();

    function sendMessage(msgObj) {
      const msgStr = JSON.stringify(msgObj);
      ws.send(msgStr);
    }
    ws.onmessage = function (message) {
      const msgObj = JSON.parse(message.data);
      switch (msgObj.id) {
        case "startResponse":
          if (!sessionId) setWSSessionId(msgObj.sessionId);
          webRtcPeer.processAnswer(msgObj.sdpAnswer, function (error) {
            if (error) return console.log(`ERROR! ${error}`);
          });
          break;
        case "iceCandidate":
          webRtcPeer.addIceCandidate(msgObj.candidate, function (error) {
            if (error) return console.log(`ERROR! ${error}`);
          });
          break;
        case "stopped":
          break;
        case "paused":
          break;
        case "recording":
          showScreen();
          timer.startTimer();
          ttsService(questions[questionNumState], volume);
          break;
        default:
          console.log(`ERROR! ${msgObj}`);
          break;
      }
    };

    function record() {
      hideScreen();

      const options = {
        localVideo: myFace,
        mediaConstraints: getVideoConstraints(640, 360),
        onicecandidate: onIceCandidate,
      };
      if (typeof kurentoUtils === "undefined") return;
      webRtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(
        options,
        function (error) {
          if (error) return console.log(`ERROR! ${error}`);
          webRtcPeer.generateOffer(onOffer);
        }
      );
    }
    function onIceCandidate(candidate) {
      sendMessage({
        id: "onIceCandidate",
        candidate: candidate,
      });
    }
    function onOffer(error, offerSdp) {
      if (error) return console.log(`ERROR! ${error}`);
      sendMessage({
        id: "start",
        sdpOffer: offerSdp,
        mode: "video-and-audio",
        name: questionNumState,
      });
    }

    function save() {
      if (webRtcPeer) {
        webRtcPeer.dispose();
        webRtcPeer = null;
        sendMessage({
          id: "stop",
        });
      }
    }

    function hideScreen() {
      setIsWait(true);
    }
    function showScreen() {
      setIsWait(false);
    }

    let isVolState = isVol;
    function controlVolume() {
      isVolState = !isVolState;
      setIsVol(isVolState);
    }
    function restartQuestion() {
      record();
      timer.stopTimer();
      return;
    }
    function saveAndNext() {
      save();
      timer.stopTimer();
      pushRecordedQuestionIdx(questionNumState);
      if (questionNumState === questions.length - 1) {
        router.push(`/self-practice/interview/end`);
        return;
      }
      questionNumState += 1;
      setSelectedQuestion(questions[questionNumState]);
      record();
      return;
    }
    function skipQuestion() {
      timer.stopTimer();
      if (questionNumState === questions.length - 1) {
        router.push(`/self-practice/interview/end`);
        return;
      }
      questionNumState += 1;
      setSelectedQuestion(questions[questionNumState]);
      record();
      return;
    }
    function setVolume(e) {
      volume = e.target.value;
    }
    // return 함수에서 .current를 사용하면 에러가 남
    const volumeButton = volumeBtn.current;
    const restartButton = restartBtn.current;
    const saveButton = saveBtn.current;
    const skipButton = skipBtn.current;
    const volVar = volumeBar.current;
    let volume = 50;
    volVar.value = volume;
    volumeButton.addEventListener("click", controlVolume);
    restartButton.addEventListener("click", restartQuestion);
    saveButton.addEventListener("click", saveAndNext);
    skipButton.addEventListener("click", skipQuestion);
    volVar.addEventListener("change", setVolume);
    record();
    window.addEventListener("beforeunload", () => {
      const delMsg = JSON.stringify({ id: "del" });
      ws.send(delMsg);
      ws.close();
    });
    return () => {
      timer.stopTimer();
      volumeButton.removeEventListener("click", controlVolume);
      restartButton.removeEventListener("click", restartQuestion);
      saveButton.removeEventListener("click", saveAndNext);
      skipButton.removeEventListener("click", skipQuestion);
      volVar.removeEventListener("change", setVolume);
    };
  }, []);
  return (
    <div className={styles.body}>
      <Title title="혼자연습한당"></Title>
      <Link href="/self-practice/interview/end">
        <a className={styles.closeBtn}>
          <span>
            <i className="fas fa-times"></i>
          </span>
          <div>종료</div>
        </a>
      </Link>
      <div className={styles.timer}>
        <Timer />
      </div>
      <div className={styles.container}>
        <div className={styles.interviewContainer}>
          <div className={styles.top}>
            <div className={styles.selectContainer}>
              <div className={styles.changeBtn}>
                <span
                  onClick={() => setScreenNum(1)}
                  className={`${styles.tooltip}  ${
                    screenNum === 1 ? styles.active : null
                  }`}
                >
                  <i className="fas fa-question"></i>
                  <span className={styles.icon}>질문 다시 보기</span>
                </span>
                <span
                  onClick={() => setScreenNum(2)}
                  className={`${styles.tooltip} ${
                    screenNum === 2 ? styles.active : null
                  }`}
                >
                  <i className="fas fa-eye"></i>
                  <span className={styles.icon}>내 얼굴 보기</span>
                </span>
                <span
                  onClick={() => setScreenNum(3)}
                  className={`${styles.tooltip} ${
                    screenNum === 3 ? styles.active : null
                  }`}
                >
                  <i className="fas fa-user"></i>
                  <span className={styles.icon}>면접관 얼굴 보기</span>
                </span>
              </div>
            </div>
            <div className={styles.videoContainer}>
              <div className={styles.video}>
                <div
                  style={isWait || screenNum !== 1 ? { display: "none" } : {}}
                  className={`${styles.video1}`}
                >
                  <ShowQuestion />
                </div>
                <div
                  style={isWait || screenNum !== 2 ? { display: "none" } : {}}
                  className={styles.video2}
                >
                  <video id="my-face"></video>
                </div>
                <div
                  style={isWait || screenNum !== 3 ? { display: "none" } : {}}
                  className={styles.video3}
                >
                  <div className={styles.interviewerContainer}>
                    <video
                      className={styles.interviewer}
                      autoPlay
                      muted
                      loop
                      src={`/images/interviewers/${videoNum}.mp4`}
                    />
                  </div>
                </div>
                <div
                  style={!isWait ? { display: "none" } : {}}
                  className={styles.video4}
                >
                  <img src="/images/loading.gif" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.btnContainer}>
        <span>
          <span
            className={`${styles.cursorBtn} ${styles.btn} ${styles.btn1}`}
            ref={volumeBtn}
          >
            <i className="fas fa-volume-up"></i>
          </span>
          <input
            className={`${styles.cursorBtn} ${styles.volume} ${
              !isVol ? styles.hide : null
            }`}
            type="range"
            min="0"
            max="100"
            step="1"
            ref={volumeBar}
          />
          <div className={styles.btnDescription}>소리 설정</div>
        </span>
        <span>
          <span
            className={`${styles.cursorBtn} ${styles.btn} ${styles.btn2} ${
              isWait ? styles.hide : null
            }`}
            ref={restartBtn}
          >
            <i className="fas fa-redo-alt"></i>
          </span>
          <span
            className={`${styles.blockBtn} ${styles.btn} ${styles.btn2} ${
              !isWait ? styles.hide : null
            }`}
          >
            <i className="fas fa-redo-alt"></i>
          </span>
          <div className={styles.btnDescription}>다시 시작</div>
        </span>
        <span>
          <span
            className={`${styles.cursorBtn} ${styles.btn} ${styles.btn3} ${
              isWait ? styles.hide : null
            }`}
            ref={saveBtn}
          >
            <i className="fas fa-check"></i>
          </span>
          <span
            className={`${styles.blockBtn} ${styles.btn} ${styles.btn3} ${
              !isWait ? styles.hide : null
            }`}
          >
            <i className="fas fa-redo-alt"></i>
          </span>
          <div className={styles.btnDescription}>답변 완료</div>
        </span>
        <span>
          <span
            ref={skipBtn}
            className={`${styles.cursorBtn} ${styles.tooltipdown} ${
              styles.btn
            } ${styles.btn4} ${isWait ? styles.hide : null}`}
          >
            <i className="fas fa-arrow-right"></i>
            <span className={styles.icon}>
              스킵한 질문은 영상이 저장되지 않습니다.
            </span>
          </span>
          <span
            className={`${styles.blockBtn} ${styles.btn} ${styles.btn4} ${
              !isWait ? styles.hide : null
            }`}
          >
            <i className="fas fa-arrow-right"></i>
          </span>
          <div className={styles.btnDescription}>스킵</div>
        </span>
      </div>
    </div>
  );
}
