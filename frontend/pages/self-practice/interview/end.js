import { useEffect } from "react";
import styles from "../../../scss/self-practice/interview/end.module.scss";
import { connect } from "react-redux";
import { WEBRTC_URL } from "../../../config"
import multiDownload from 'multi-download';

function mapStateToProps(state) {
  const questions = state.questionReducer.questions.map(question => question.question)
  return {
    ws: state.wsReducer.ws,
    sessionId: state.wsReducer.sessionId,
    questions,
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
    async function download(idx) {
      // const element = document.createElement('a');
      // element.setAttribute('href',`${WEBRTC_URL}/kurento/download/${sessionId}${idx}.webm`);
      // element.setAttribute('download', `${sessionId}${idx}.webm`);
      // document.body.appendChild(element);
      // element.click();
      // document.body.removeChild(element);
      window.open(`${WEBRTC_URL}/kurento/download/${sessionId}${idx}.webm`);
    }
    function allDownload(e) {
      const urls = []
      for(let idx of recordedQuestionIdxes) {
        urls.push(`${WEBRTC_URL}/kurento/download/${sessionId}${idx}.webm`)
      }
      multiDownload(urls)
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
    const allDownloadBtn = document.getElementById("allDownloadBtn")
    allDownloadBtn.addEventListener("click", allDownload)
  }, [])
  return <div className={styles.body}>
    <h1>면접이 종료되었습니다.</h1>
    <div className={styles.btn}>
        <button id="allDownloadBtn">전체 다운로드</button>
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
            return <div key={idx} className={styles.recordList}>
            <div>
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