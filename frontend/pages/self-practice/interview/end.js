import { useEffect } from "react";
import styles from "../../../scss/self-practice/interview/end.module.scss";
import { connect } from "react-redux";
import { WEBRTC_URL } from "../../../config"


function mapStateToProps(state) {
  return {
    ws: state.wsReducer.ws,
    sessionId: state.wsReducer.sessionId,
    questions: state.questionReducer.questions,
    recordedQuestionIdxes: state.wsReducer.recordedQuestionIdxes,
    speakerId: state.videoReducer.speakerId,
  };
}
export default connect(mapStateToProps, null)(EndInterview)

function EndInterview({ws, sessionId, questions, recordedQuestionIdxes, speakerId}) {
  useEffect(()=>{
    if(!ws) window.location.href = "/self-practice/interview/select-questionlist";
    const myVideo = document.querySelector("#my-video")
    myVideo.setSinkId(speakerId);
    let webRtcPeer;

    function sendMessage(msgObj) {
      const msgStr = JSON.stringify(msgObj);
      ws.send(msgStr);
    }
    ws.onmessage = function(message) {
      const msgObj = JSON.parse(message.data);
      switch(msgObj.id) {
        case "playResponse":
          webRtcPeer.processAnswer(msgObj.sdpAnswer, function(error) {
            if (error) return console.log(`ERROR! ${error}`);
          });
          break;
        case "iceCandidate":
          if(webRtcPeer) {
            webRtcPeer.addIceCandidate(msgObj.candidate, function(error) {
              if(error) return console.log(`ERROR! ${error}`);
            })
            break;
          }
        default:
          console.log(`ERROR! ${msgObj}`)
          break;
      }
    }
    function play(idx) {
      myVideo.src = `${WEBRTC_URL}/files/videos/${sessionId + idx}.webm`
    }

    function download(idx) {
      window.open(`${WEBRTC_URL}/kurento/download/${sessionId}${idx}.webm`);
    }
    for(let idx of recordedQuestionIdxes) {
      const playId = idx + "-play"
      const downloadId = idx + "-download"
      const playBtn = document.getElementById(playId)
      const downloadBtn = document.getElementById(downloadId)
      function playCurVideo() {
        play(idx)
      }
      function downloadCurVideo(){
        download(idx)
      }
      playBtn.addEventListener("click", playCurVideo)
      downloadBtn.addEventListener("click", downloadCurVideo)
    }
  }, [])
  return <div className={styles.body}>
    <h1>면접끝</h1>
    <div className={styles.btn}>
        <button>전체 다운로드</button>
    </div>
    <div className={styles.comp}>
      <div className={styles.videoComp}>
        <video controls autoPlay width={"480px"} height={"360px"} id="my-video" />
      </div>
      <div className={styles.recordComp}>
        {/* <div className={styles.recordCompTop}>
            <button>전체 다운로드</button>
        </div> */}
        {questions.map((question, idx) => {
          if(recordedQuestionIdxes.some(recordedIdx => recordedIdx===idx)) {
            return <div className={styles.recordList}>
            <div key={idx}>
              <span>질문 {idx+1}. {question}</span>
              <button id={`${idx}-play`}><i className="fas fa-play"></i></button>
              <button id={`${idx}-download`}><i className="fas fa-download"></i></button>
            </div>
            </div>
          }
        })}
      </div>
    </div>
  </div>
}