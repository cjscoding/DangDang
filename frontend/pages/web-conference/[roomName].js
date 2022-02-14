import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import CameraSelect from "../../components/webRTC/devices/CameraSelect";
import MicSelect from "../../components/webRTC/devices/MicSelect";
import SpeakerSelect from "../../components/webRTC/devices/SpeakerSelect";
import Timer from "../../components/webRTC/self-practice/Timer";
import timer from "../../components/webRTC/timer"
import getVideoConstraints from "../../components/webRTC/getVideoConstraints";
import styles from "../../scss/web-conference/mainComponent.module.scss";
import SockJS from "sockjs-client";
import { WEBRTC_URL } from "../../config";

function mapStateToProps(state) {
  return {
    ws: state.wsReducer.ws,
    myIdName: `${state.userReducer.user.id}-${state.userReducer.user.nickName}`, // id + - + nickName
    cameraId: state.videoReducer.cameraId,
    micId: state.videoReducer.micId,
    speakerId: state.videoReducer.speakerId,
  };
}
export default connect(mapStateToProps, null)(Conference);
function Conference({ws, myIdName, cameraId, micId, speakerId}) {
  const [me, setMe] = useState(null)
  const [mode, setMode] = useState(false) // 면접모드 true, 일반모드 false
  const [applicant, setApplicant] = useState("")
  const [screenShareTry, setScreenShareTry] = useState(false)
  const [screenShare, setScreenShare] = useState(false)
  const [screenShareUser, setScreenShareUser] = useState("");

  const [cameraSelectShow, setCameraSelectShow] = useState(false)
  const [micSelectShow, setMicSelectShow] = useState(false)
  const [speakerSelectShow, setSpeakerSelectShow] = useState(false)

  const chatInput = useRef();
  const chatInputBtn = useRef();
  const chatContentBox = useRef();
  const cameraBtn = useRef();
  const micBtn = useRef();
  const speakerBtn = useRef();
  const screenBtn = useRef();
  const changeModeBtn = useRef();
  const exitBtn = useRef();
  const cameraSelectDiv = useRef();

  const router = useRouter();

  useEffect(() => {
    const roomName = router.query.roomName
    const myName = myIdName.slice(1 + myIdName.search('-'), myIdName.length);
    let meState = null
    // 새로고침 로직 다른거 생각중
    if(!ws) window.close();
    let participants = {};

    function Participant(IdName, isCam) {
      let rtcPeer;
      const idx = IdName.search('-')
      this.id = IdName.slice(0, idx)
      this.name = IdName.slice(1 + idx, IdName.length);

      const container = document.createElement('span');
      container.id = IdName;
      const span = document.createElement('span');
      span.innerText = this.name
      const video = document.createElement('video');
      video.id = 'video-' + IdName;
      video.autoplay = true;
      video.controls = false;
      if(this.id === "screen") {
        video.style.height = "calc(60vh - 1.5rem)"
        video.style.width = "calc(106.667vh - 2.667rem)"
        video.style.maxHeight = "calc(675px - 15rem)"
        video.style.maxWidth = "calc(1200px - 26.667rem)"
        video.style.minHeight = "28.5rem"
        video.style.minWidth = "50.667rem"
      }else {
        if(screenShareState) {
          video.style.width = "calc(35.556vh - 3.556rem)"
          video.style.height = "calc(20vh - 2rem)"
          video.style.maxHeight = "calc(19.688vh - 2.344rem)"
          video.style.maxWidth = "calc(35vh - 4.16rem)"
          video.style.minHeight = "8.5rem"
          video.style.minWidth = "15.111rem"
          video.style.borderRadius = "0.6rem"
        }else {
          video.style.width = "calc((90vw - 24rem - 2rem) / 2)"
          video.style.height = "calc((90vw - 24rem - 2rem) * 9 / 32)"
          video.style.maxHeight = "calc(40vh - 1.5rem)"
          video.style.maxWidth = "calc(71.111vh - 2.667rem"
          video.style.minHeight = "8.5rem"
          video.style.minWidth = "15.111rem"
          video.style.borderRadius = "1rem"
        }
      }
      video.style.border = "2px"
      video.style.borderStyle = "solid"
      video.style.backgroundColor = "black"
      if(video.sinkId !== speakerId) video.setSinkId(speakerId)
      container.appendChild(video);
      container.appendChild(span);
      container.style = "display: flex; flex-direction: column; align-items: center;"

      if(!isCam) {
        // pass
      }else if(this.id === "screen") {
        document.getElementById('screens').appendChild(container);
        span.innerText = this.name.slice(1 + this.name.search('-'), this.name.length) + "'s screen";
      }else {
        document.getElementById('participants').appendChild(container);
      }
    
      this.getElement = function() {
        return container;
      }
      this.getVideoElement = function() {
        return video;
      }
      if(isCam) {
        this.offerToReceiveVideo = function(error, offerSdp, wp){
          if (error) return console.log(`ERROR! ${error}`)
          sendMessage({ 
            id : "receiveVideoFrom",
            sender : IdName,
            sdpOffer : offerSdp
          });
        }
      }else {
        this.offerToReceiveVideo = function(error, offerSdp, wp){
          if (error) return console.log(`ERROR! ${error}`)
          screenMessage({ 
            id : "receiveVideoFrom",
            sender : IdName,
            sdpOffer : offerSdp
          });
        }
      }
      if(isCam) {
        this.onIceCandidate = function (candidate, wp) {
          sendMessage({
            id: 'onIceCandidate',
            candidate: candidate,
            name: IdName
          });
        }
      }else {
        this.onIceCandidate = function (candidate, wp) {
          screenMessage({
            id: 'onIceCandidate',
            candidate: candidate,
            name: IdName
          });
        }
      }
      this.dispose = function() {
        this.rtcPeer.dispose();
        container.parentNode.removeChild(container);
      };

      Object.defineProperty(this, 'rtcPeer', { writable: true});
    }
    function sendMessage(message) {
      const jsonMessage = JSON.stringify(message);
      // console.log("Sending message: " + jsonMessage);
      ws.send(jsonMessage);
    }
    ws.onmessage = function(message) {
      const jsonMsg = JSON.parse(message.data);
      // console.log("Received message: " + message.data);
      switch (jsonMsg.id) {
        case "existingParticipants":
          onExistingParticipants(jsonMsg);
          break;
        case "newParticipantArrived":
          if(myIdName === screenShareAppliedUser) {
            sendMessage({
              id: "mode",
              position: screenShareTryState?`screenShareTry`:`notScreenShareTry`
            })
            if(screenShareState) {
              sendMessage({
                id: "mode",
                position: `screenShare`
              })
            }
          }
          if(myIdName === volunteerUser) {
            sendMessage({
              id: "mode",
              position: "volunteer"
            })
          }
          onNewParticipant(jsonMsg);
          break;
        case "participantLeft":
          onParticipantLeft(jsonMsg);
          break;
        case "receiveVideoAnswer":
          receiveVideoResponse(jsonMsg);
          break;
        case "iceCandidate":
          participants[jsonMsg.name].rtcPeer.addIceCandidate(jsonMsg.candidate, function (error) {
            if (error) return console.log(`ERROR! ${error}`);
          });
          break;
        case "chat":
          onReceiveChat(jsonMsg);
          break;
        case "mode":
          onMode(jsonMsg);
          break;
        case "duplicateName":
          alert("이미 참가한 유저입니다.")
          window.close();
          break
        default:
          console.log(`ERROR! ${jsonMsg}`)
      }
    }

    function onNewParticipant(jsonMsg) {
      receiveVideo(jsonMsg.name);
    }
    function receiveVideoResponse(jsonMsg) {
      participants[jsonMsg.name].rtcPeer.processAnswer(jsonMsg.sdpAnswer, function(error) {
        if(error) return console.log(`ERROR! ${error}`);
      });
    }
    function onExistingParticipants(jsonMsg) {
      const participant = new Participant(myIdName, true);
      participants[myIdName] = participant;
      
      const options = {
        localVideo: participant.getVideoElement(),
        mediaConstraints: getVideoConstraints(480, 270),
        onicecandidate: participant.onIceCandidate.bind(participant)
      }
      participant.rtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(options, function(error) {
        if(error) return console.log(`ERROR! ${error}`);
        this.generateOffer(participant.offerToReceiveVideo.bind(participant));
      });
      jsonMsg.data.forEach(receiveVideo);
      meState = participant
      setMe(meState);
    }
    
    function receiveVideo(senderIdName) {
      // if(senderIdName === "-screen") return receiveScreen(senderIdName);
      const participant = new Participant(senderIdName, true);
      participants[senderIdName] = participant;

      const options = {
        remoteVideo: participant.getVideoElement(),
        onicecandidate: participant.onIceCandidate.bind(participant)
      }
    
      participant.rtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(options, function(error) {
        if(error) return console.log(`ERROR! ${error}`);
        this.generateOffer(participant.offerToReceiveVideo.bind(participant));
      });
    }

    function onParticipantLeft(jsonMsg) {
      const participant = participants[jsonMsg.name];
      participant.dispose();
      delete participants[jsonMsg.name];
    }

    function ScreenHandler() {
      // console.log('Loaded ScreenHandler', arguments);
      // REF https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#Properties_of_shared_screen_tracks
      const constraints = {
        audio: true,
        video: {
          width: 800, // 최대 너비
          height: 450, // 최대 높이
          frameRate: 10, // 최대 프레임
        },
      };
      let localStream = null;

      // 스크린캡쳐 API를 브라우저 호환성 맞게 리턴합니다.
      function getCrossBrowserScreenCapture() {
        if (navigator.getDisplayMedia) {
            return navigator.getDisplayMedia(constraints);
        } else if (navigator.mediaDevices.getDisplayMedia) {
            return navigator.mediaDevices.getDisplayMedia(constraints);
        }
      }
      // 스크린캡쳐 API를 호출합니다.
      async function start() {
        try {
          localStream = await getCrossBrowserScreenCapture();
        } catch (err) {
          console.log(`CANCEL! ${err}`);
        }
        return localStream;
      }
      // 스트림의 트렉을 stop()시켜 스트림이 전송을 중지합니다.
      function end() {
        screenShareTryState = false
        setScreenShareTry(screenShareTryState);
        screenShareState = false
        setScreenShare(screenShareState)
        screenShareAppliedUser = ""
        setScreenShareUser(screenShareAppliedUser)
        sendMessage({
          id: "mode",
          position: `notScreenShare`
        })
        stream = null;
        screenMessage({
          id: "leaveRoom"
        });
        screenWs.close();

        localStream.getTracks().forEach((track) => {
            track.stop();
        });
      }
      this.start = start;
      this.end = end;
    }

    function screenMessage(message) {
      const jsonMessage = JSON.stringify(message);
      // console.log("Sending message: " + jsonMessage);
      screenWs.send(jsonMessage);
    }

    let screen;
    function existingScreens(jsonMsg) {
      screen = new Participant(`screen-${myIdName}`, false);
      const options = {
        videoStream: stream,
        mediaConstraints: {
          audio: true,
          video: { mandatory: { maxWidth: 320, maxFrameRate: 10, minFrameRate: 10 } }
        },
        onicecandidate: screen.onIceCandidate.bind(screen),
      }

      screen.rtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(options, function(error) {
        if(error) return console.log(`ERROR! ${error}`);
        this.generateOffer(screen.offerToReceiveVideo.bind(screen));
      });
    }

    let screenShareAppliedUser = "";
    let volunteerUser = "";
    function onMode(jsonMsg) {
      if(jsonMsg.name !== myIdName) {
        switch(jsonMsg.position) {
          case "screenShareTry":
            screenShareAppliedUser = jsonMsg.name
            screenShareTryState = true
            break
          case "notScreenShareTry":
            screenShareAppliedUser = jsonMsg.name
            screenShareTryState = false
            break
          case "screenShare":
            screenShareAppliedUser = jsonMsg.name
            screenShareState = true
            screenShareTryState = true
            break
          case "notScreenShare":
            screenShareAppliedUser = ""
            screenShareState = false
            screenShareTryState = false
            break
          case "normal":
            volunteerUser = ""
            modeState = false
            timer.stopTimer()
            break
          case "volunteer":
            volunteerUser = jsonMsg.name
            modeState = true
            timer.startTimer()
            break
          default:
            console.log(`ERROR! ${jsonMsg.mode}`)
            break
        }
        console.log(volunteerUser)
        setScreenShareTry(screenShareTryState);
        setScreenShare(screenShareState)
        setScreenShareUser(screenShareAppliedUser)
        setMode(modeState)
        setApplicant(volunteerUser)
      }
    }

    let stream;
    let screenWs;
    let screenHandler;
    let screenShareState = false
    let screenShareTryState = false
    async function startScreenShare() {
      if(!stream) {
        screenWs = new SockJS(`${WEBRTC_URL}/groupcall`);
        screenShareTryState = true
        sendMessage({
          id: "mode",
          position: `screenShareTry`
        })
        screenHandler = new ScreenHandler();
        stream = await screenHandler.start();
        if(stream) {
          if(!screenShareState) {
            stream.oninactive = () => screenHandler.end()
            // screenShareTryState = false
            setScreenShareTry(false);
            screenShareState = true
            setScreenShare(screenShareState)
            screenShareAppliedUser = myIdName
            setScreenShareUser(screenShareAppliedUser)
            sendMessage({
              id: "mode",
              position: `screenShare`
            })
            screenMessage({
              id: "joinRoom",
              name: `screen-${myIdName}`,
              room: roomName,
            });
            screenWs.onmessage = function(message) {
              const jsonMsg = JSON.parse(message.data);
              // console.log("Received message: " + message.data);
              switch(jsonMsg.id) {
                case "existingParticipants":
                  existingScreens(jsonMsg)
                  break;
                case "newParticipantArrived":
                  break;
                case "participantLeft":
                  break;
                case "receiveVideoAnswer":
                  screen.rtcPeer.processAnswer(jsonMsg.sdpAnswer, function(error) {
                    if(error) return console.log(`ERROR! ${error}`);
                  });
                  break;
                case "iceCandidate":
                  screen.rtcPeer.addIceCandidate(jsonMsg.candidate, function (error) {
                    if (error) return console.log(`ERROR! ${error}`);
                  });
                  break;
                case "chat":
                  break;
                case "mode":
                  break;
                default:
                  console.log(`ERROR! ${jsonMsg}`)
              }
            }
          }else {
            alert("화면은 한 명만 공유 가능합니다.")
          }
        }else {
          screenShareTryState = false
          sendMessage({
            id: "mode",
            position: `notScreenShareTry`
          })
          screenWs.close();
        }
      }else {
        screenHandler.end()
      }
    }

    const chatContentBoxEl = chatContentBox.current
    function onReceiveChat(jsonMsg) {
      const senderIdName = jsonMsg.sessionName
      const senderName = senderIdName.slice(1 + senderIdName.search('-'), senderIdName.length);
      const showingMsg = `${senderName}: ${jsonMsg.contents}`
      const name = document.createElement("h4")
      name.innerText = senderName + '\u00a0'
      name.style.display = "inline"
      const text = document.createElement("p")
      text.innerText = `: ${jsonMsg.contents}`
      text.style.display = "inline"
      const showingMsgEl = document.createElement("div")
      showingMsgEl.appendChild(name)
      showingMsgEl.appendChild(text)
      chatContentBoxEl.appendChild(showingMsgEl)
      chatContentBoxEl.scrollTop = chatContentBoxEl.scrollHeight
    }

    function sendChatMsg() {
      const chatMsg = chatInputEl.value.trim()
      if(chatMsg) {
        sendMessage({
          id: "chat",
          contents: chatMsg
        })
      }
      chatInputEl.value = ""
    }
    function enterInput(event) {
      switch(event.key) {
        case "Enter":
          event.preventDefault();
          sendChatMsg()
          break
        default:
          break;
      }
    }
    const chatInputEl = chatInput.current
    const chatInputBtnEl = chatInputBtn.current
    chatInputBtnEl.addEventListener("click", sendChatMsg)
    chatInputEl.addEventListener("keypress", enterInput)

    const cameraBtnEl = cameraBtn.current
    const micBtnEl = micBtn.current
    const speakerBtnEl = speakerBtn.current
    const screenBtnEl = screenBtn.current
    const changeModeBtnEl = changeModeBtn.current
    const exitBtnEl = exitBtn.current

    let cameraShowState = false
    let micShowState = false
    let speakerShowState = false
    function allSelectShowFalse() {
      cameraShowState = false
      micShowState = false
      speakerShowState = false
      setCameraSelectShow(cameraShowState)
      setMicSelectShow(micShowState)
      setSpeakerSelectShow(speakerShowState)
    }
    function cameraSelectToggle() {
      cameraShowState = !cameraShowState
      micShowState = false
      speakerShowState = false
      setCameraSelectShow(cameraShowState)
      setMicSelectShow(micShowState)
      setSpeakerSelectShow(micShowState)
    }
    function micSelectToggle() {
      cameraShowState = false
      micShowState = !micShowState
      speakerShowState = false
      setCameraSelectShow(cameraShowState)
      setMicSelectShow(micShowState)
      setSpeakerSelectShow(speakerShowState)
    }
    function speakerSelectToggle() {
      cameraShowState = false
      micShowState = false
      speakerShowState = !speakerShowState
      setCameraSelectShow(cameraShowState)
      setMicSelectShow(micShowState)
      setSpeakerSelectShow(speakerShowState)
    }
    cameraBtnEl.addEventListener("click", cameraSelectToggle)
    micBtnEl.addEventListener("click", micSelectToggle)
    speakerBtnEl.addEventListener("click", speakerSelectToggle)

    function exitRoom() {
      if(confirm("정말 나가시겠습니까?")) {
        window.close()
      }
    }
    exitBtnEl.addEventListener("click", exitRoom)
    exitBtnEl.addEventListener("click", allSelectShowFalse)

    let modeState = false;
    function changeMode() {
      if(modeState) {
        if(!confirm("일반 모드로 바꾸시겠습니까?")) return
        timer.stopTimer()
      }else {
        if(!confirm("면접 모드로 바꾸시겠습니까?")) return
        timer.startTimer()
      }
      modeState = !modeState
      if(modeState) {
        volunteerUser = myIdName
      }else {
        volunteerUser = ""
      }
      setApplicant(volunteerUser)
      setMode(modeState)
      sendMessage({
        id: "mode",
        position: modeState?"volunteer":"normal"
      })
    }
    changeModeBtnEl.addEventListener("click", changeMode)
    screenBtnEl.addEventListener("click", startScreenShare)
    changeModeBtnEl.addEventListener("click", allSelectShowFalse)
    screenBtnEl.addEventListener("click", allSelectShowFalse)
    // 방 입장
    sendMessage({
      id: "joinRoom",
      name: myIdName,
      room: roomName,
    });

    function beforeunload() {
      if(stream) {
        sendMessage({
          id: "mode",
          position: `notScreenShare`
        })
        screenMessage({
          id: "leaveRoom"
        });
        screenWs.close();
      }
      sendMessage({
        id: "leaveRoom"
      });
      ws.close()
      for (let key in participants) {
        participants[key].dispose();
      }
    }
    window.addEventListener("beforeunload", beforeunload)
    // console.log(cameraSelectDiv.current.childNodes[0])
    return () => {
      chatInputBtnEl.removeEventListener("click", sendChatMsg)
      chatInputEl.removeEventListener("keypress", enterInput)
      screenBtnEl.removeEventListener("click", startScreenShare)
      changeModeBtnEl.removeEventListener("click", allSelectShowFalse)
      screenBtnEl.removeEventListener("click", allSelectShowFalse)
      cameraBtnEl.removeEventListener("click", cameraSelectToggle)
      micBtnEl.removeEventListener("click", micSelectToggle)
      speakerBtnEl.removeEventListener("click", speakerSelectToggle)
      exitBtnEl.removeEventListener("click", exitRoom)
      exitBtnEl.removeEventListener("click", allSelectShowFalse)
      // 방 퇴장
      window.removeEventListener("beforeunload", beforeunload)
      beforeunload()
    }
  }, [])

  useEffect(async() => {
    if(me) {
      const newStream = await navigator.mediaDevices.getUserMedia(
        getVideoConstraints(480, 270)
      );
      const videoSender = me.rtcPeer.peerConnection.getSenders().find(sender => sender.track.kind === "video")
      const audioSender = me.rtcPeer.peerConnection.getSenders().find(sender => sender.track.kind === "audio")
      videoSender.replaceTrack(newStream.getVideoTracks()[0])
      audioSender.replaceTrack(newStream.getAudioTracks()[0])
      me.getVideoElement().srcObject = newStream
    }
  }, [cameraId, micId])

  useEffect(() => {
    for(let container of document.querySelector("#participants").children) {
      const video = container.firstChild
      if(video.sinkId !== speakerId) video.setSinkId(speakerId)
    }
    for(let container of document.querySelector("#participants").children) {
      const video = container.firstChild
      if(video.sinkId !== speakerId) video.setSinkId(speakerId)
    }
  },[speakerId])

  useEffect(() => {
    if(screenShare) {
      const participantsEl = document.getElementById("participants")
      for(let videoContainer of participantsEl.childNodes) {
        const video = videoContainer.firstChild
        video.style.width = "calc(35.556vh - 3.556rem)"
        video.style.height = "calc(20vh - 2rem)"
        video.style.maxHeight = "calc(19.688vh - 2.344rem)"
        video.style.maxWidth = "calc(35vh - 4.16rem)"
        video.style.minHeight = "8.5rem"
        video.style.minWidth = "15.111rem"
        video.style.borderRadius = "0.6rem"
      }
    }else {
      const participantsEl = document.getElementById("participants")
      for(let videoContainer of participantsEl.childNodes) {
        const video = videoContainer.firstChild
        video.style.width = "calc((90vw - 24rem - 2rem) / 2)"
        video.style.height = "calc((90vw - 24rem - 2rem) * 9 / 32)"
        video.style.maxHeight = "calc(40vh - 1.5rem)"
        video.style.maxWidth = "calc(71.111vh - 2.667rem"
        video.style.minHeight = "8.5rem"
        video.style.minWidth = "15.111rem"
        video.style.borderRadius = "1rem"
      }
    }
  }, [screenShare])

  useEffect(() => {
    const participantsEl = document.getElementById("participants")
    for(let videoContainer of participantsEl.childNodes) {
      const video = videoContainer.firstChild
      if(video.id === `video-${screenShareUser}`) {
        video.style.border = "2px"
        video.style.borderStyle = "solid"
        video.style.borderColor = "#BDECB6"
        video.style.backgroundColor = "#BDECB6"
      }else {
        video.style.border = "2px"
        video.style.borderStyle = "solid"
        video.style.borderColor = "black"
        video.style.backgroundColor = "black"
      }
    }
  }, [screenShareUser])

  return <div>
    <div className={styles.mainContainer}>
      <div className={styles.mainSection}>
        <div id="videoContainer" className={styles.videoContainer}>
          <div className={styles.screens} id="screens" ></div>
          <div className={styles.faces} id="participants"></div>
        </div>
        <div style={applicant===myIdName?{display: "none"}:{}} className={styles.subContainer}>
          <div className={styles.subContainerTopBar}>
            <span>
              <span className={`${styles.selectedMenuBtn} ${styles.chatMenuBtn}`}>채팅창</span>
              <span style={mode?{}:{display: "none"}} className={` ${styles.letterMenuBtn}`}>자소서</span>
            </span>
            <span style={mode?{}:{display: "none"}} className={styles.timer}>
              <Timer />
            </span>
          </div>
          <div className={styles.chatContainer} id="chat">
            <div ref={chatContentBox} className={styles.chat}></div>
            <div className={styles.chatInput}>
              <input ref={chatInput} />
              <button ref={chatInputBtn} ><i className="fas fa-paper-plane"></i></button>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.btnBar}>
        <span>
          <span ref={cameraBtn}><i className="fas fa-video"></i></span>
          <div style={cameraSelectShow?{}:{display: "none"}} ref={cameraSelectDiv}><CameraSelect /></div>
        </span>
        <span>
          <span ref={micBtn}><i className="fas fa-microphone"></i></span>
          <div style={micSelectShow?{}:{display: "none"}}><MicSelect /></div>
        </span>
        <span>
          <span ref={speakerBtn}><i className="fas fa-volume-up"></i></span>
          <div style={speakerSelectShow?{}:{display: "none"}}><SpeakerSelect /></div>
        </span>
        <span>
          <span style={screenShareTry?{display: "none"}:{}} ref={screenBtn}><i className="fas fa-chalkboard"></i></span>
          <span style={!screenShareTry?{display: "none"}:{}} className={styles.nonCursor}><i className="fas fa-chalkboard-teacher"></i></span>
        </span>
        <span ref={changeModeBtn} >
          <span style={mode?{display: "none"}:{}}><i className="fas fa-user-tie"></i></span>
          <span style={!mode?{display: "none"}:{}}><i className="fas fa-users"></i></span>
        </span>
        <span ref={exitBtn}><i className="fas fa-times-circle"></i></span>
      </div>
    </div>
  </div>
}