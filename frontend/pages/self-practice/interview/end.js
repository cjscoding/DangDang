import { useEffect } from "react";
import { connect } from "react-redux";
import { WEBRTC_URL } from "../../../config"

function mapStateToProps(state) {
  return {
    ws: state.wsReducer.ws,
    sessionId: state.wsReducer.sessionId,
    questions: state.questionReducer.questions,
    recordedQuestionIdxes: state.wsReducer.recordedQuestionIdxes,
    cameraId: state.videoReducer.cameraId, 
    micId: state.videoReducer.micId,
    speakerId: state.videoReducer.speakerId,
  };
}
export default connect(mapStateToProps, null)(EndInterview)

function EndInterview({ws, sessionId, questions, recordedQuestionIdxes, cameraId, micId, speakerId}) {
  useEffect(()=>{
    const myVideo = document.querySelector("#my-video")
    myVideo.setSinkId(speakerId);
    let webRtcPeer;
    let selectedIdx;

    function sendMessage(msgObj) {
      const msgStr = JSON.stringify(msgObj);
      console.log(`SEND: ${msgStr}`);
      ws.send(msgStr);
    }
    ws.onmessage = function(message) {
      const msgObj = JSON.parse(message.data);
      console.log(`RECEIVE: ${message.data}`);
      switch(msgObj.id) {
        case "playResponse":
          webRtcPeer.processAnswer(msgObj.sdpAnswer, function(error) {
            if (error) return console.log(`ERROR! ${error}`);
          });
          break;
        case "playEnd":
          // 몰라
        case "iceCandidate":
          try{
            webRtcPeer.addIceCandidate(msgObj.candidate, function(error) {
              if(error) return console.log(`ERROR! ${error}`);
            })
            break;
          }catch(error){console.log(`ERROR! ${error}`)}
        default:
          console.log(`ERROR! ${msgObj}`)
          break;
      }
    }

    function play(idx) {
      selectedIdx = idx
      const options = {
        remoteVideo: myVideo,
        mediaConstraints : getVideoConstraints(),
        onicecandidate : onIceCandidate
      }
      webRtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(options, function(error) {
        if (error) return console.log(`ERROR! ${error}`);
        webRtcPeer.generateOffer(onPlayOffer);
      });
    }
    function onPlayOffer(error, offerSdp) {
      if(error) return console.log(`ERROR! ${error}`)
      sendMessage({
        id: "play",
        sdpOffer: offerSdp,
        path: sessionId + selectedIdx + ".webm"
      });
    }
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
    window.onbeforeunload = function() {
      sendMessage({
        id : 'del',
      });
      ws.close();
    }
  }, [])
  return <>
    <h1>면접끝</h1>
    <video controls autoPlay width={"480px"} height={"360px"} id="my-video" />
    {questions.map((question, idx) => {
      if(recordedQuestionIdxes.some(recordedIdx => recordedIdx===idx)) {
        return <div key={idx}>
          <h4>{question}</h4>
          <button id={`${idx}-play`}><i className="fas fa-play"></i></button>
          <button id={`${idx}-download`}><i className="fas fa-download"></i></button>
        </div>
      }
    })}
  </>
}