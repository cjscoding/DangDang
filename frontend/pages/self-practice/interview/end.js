import { useEffect, useRef, useState } from "react";
import styles from "../../../scss/self-practice/interview/end.module.scss";
import { connect } from "react-redux";
import { WEBRTC_URL } from "../../../config";
import { useRouter } from "next/router";
import Title from "../../../components/layout/Title";
// import axios from "axios";
// import JSZip from "jszip"

function mapStateToProps(state) {
  const questions = state.questionReducer.questions.map(
    (question) => question.question
  );
  return {
    wsSocket: state.wsReducer.ws,
    sessionId: state.wsReducer.sessionId,
    questions,
    recordedQuestionIdxes: state.wsReducer.recordedQuestionIdxes,
    speakerId: state.videoReducer.speakerId,
  };
}
export default connect(mapStateToProps, null)(EndInterview);

function EndInterview({
  wsSocket,
  sessionId,
  questions,
  recordedQuestionIdxes,
  speakerId,
}) {
  const endBtn = useRef();
  const router = useRouter();
  const [downloadIdxes, setDownloadIdxes] = useState([])

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

    const myVideo = document.querySelector("#my-video");
    myVideo.setSinkId(speakerId);
    let webRtcPeer;

    ws.onmessage = function (message) {
      const msgObj = JSON.parse(message.data);
      switch (msgObj.id) {
        case "playResponse":
          webRtcPeer.processAnswer(msgObj.sdpAnswer, function (error) {
            if (error) return console.log(`ERROR! ${error}`);
          });
          break;
        case "iceCandidate":
          if (webRtcPeer) {
            webRtcPeer.addIceCandidate(msgObj.candidate, function (error) {
              if (error) return console.log(`ERROR! ${error}`);
            });
            break;
          }
        default:
          console.log(`ERROR! ${msgObj}`);
          break;
      }
    };
    function play(idx) {
      myVideo.src = `${WEBRTC_URL}/files/videos/${sessionId + idx}.webm`;
    }
    function download(idx) {
      window.open(`${WEBRTC_URL}/kurento/download/${sessionId}${idx}.webm`);
    }
    function allDownload(e) {
      let fileNames = ""
      for(let idx of recordedQuestionIdxes) {
        fileNames += (`fileNames=${sessionId}${idx}.webm&`)
      }
      fileNames = fileNames.slice(0, fileNames.length - 1)
      // axios({
      //   method: "get",
      //   url: `${WEBRTC_URL}/kurento/download/all?${fileNames}`,
      // })
      //   .then(async (res) => {
      //     console.log(res)
      //     const zip = new JSZip()
      //     await zip.loadAsync(res.data, {type: "uint8array"})
      //     const blob = await zip.generateAsync({type: "blob"})
      //     const a = document.createElement("a")
      //     a.setAttribute("href", window.URL.createObjectURL(blob))
      //     a.setAttribute("download")
      //     document.body.appendChild(a);
      //     a.click();
      //     document.body.removeChild(a);
      //   })
      //   .catch((err) => console.log(err))
      // setDownloadIdxes(recordedQuestionIdxes)
      window.open(`${WEBRTC_URL}/kurento/download/all?${fileNames}`);
    }
    for (let idx of recordedQuestionIdxes) {
      const playId = idx + "-play";
      const downloadId = idx + "-download";
      const playBtn = document.getElementById(playId);
      const downloadBtn = document.getElementById(downloadId);
      function playCurVideo() {
        play(idx);
      }
      function downloadCurVideo() {
        download(idx);
      }
      playBtn.addEventListener("click", playCurVideo);
      downloadBtn.addEventListener("click", downloadCurVideo);
    }
    const endBtnEl = endBtn.current;
    function endInterview() {
      if (confirm("종료하시겠습니까?")) {
        window.close();
      }
    }
    endBtnEl.addEventListener("click", endInterview);
    const allDownloadBtn = document.getElementById("allDownloadBtn");
    allDownloadBtn.addEventListener("click", allDownload);

    window.addEventListener("beforeunload", () => {
      const delMsg = JSON.stringify({ id: "del" });
      ws.send(delMsg);
      ws.close();
    });
    return () => {
      endBtnEl.removeEventListener("click", endInterview);
      allDownloadBtn.removeEventListener("click", allDownload);
    };
  }, []);

  // useEffect(() => {
  //   if(downloadIdxes.length !== 0) {
  //     const element = document.createElement('a');
  //     element.setAttribute('href',`${WEBRTC_URL}/kurento/download/${sessionId}${downloadIdxes[0]}.webm`);
  //     element.setAttribute('download', `${sessionId}${downloadIdxes[0]}.webm`);
  //     document.body.appendChild(element);
  //     element.click();
  //     document.body.removeChild(element);
  //     const remainDownloadIdxes = downloadIdxes.splice(1, downloadIdxes.length)
  //     setDownloadIdxes(remainDownloadIdxes)
  //   }
  // }, [downloadIdxes])

  return (
    <div className={styles.body}>
      <Title title="혼자연습한당"></Title>
      <div className={styles.endBtn} ref={endBtn}>
        <i className="fas fa-times"></i>
        <div>종료</div>
      </div>
      <h1>면접이 종료되었습니다.</h1>
      <div className={styles.btn}>
        <button id="allDownloadBtn">전체 다운로드</button>
      </div>
      <div className={styles.comp}>
        <div className={styles.videoComp}>
          <video
            controls
            autoPlay
            width={"480px"}
            height={"360px"}
            id="my-video"
          />
        </div>
        <div className={styles.recordComp}>
          {/* <div className={styles.recordCompTop}>
            <button>전체 다운로드</button>
        </div> */}
          {questions.map((question, idx) => {
            if (
              recordedQuestionIdxes.some((recordedIdx) => recordedIdx === idx)
            ) {
              return (
                <div key={idx} className={styles.recordList}>
                  <span>
                    질문 {idx + 1}. {question}
                  </span>
                  <div>
                    <button id={`${idx}-play`}>
                      <i className="fas fa-play"></i>
                    </button>
                    <button id={`${idx}-download`}>
                      <i className="fas fa-download"></i>
                    </button>
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}
