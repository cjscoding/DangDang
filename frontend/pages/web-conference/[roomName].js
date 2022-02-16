import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import CameraSelect from "../../components/webRTC/devices/CameraSelect";
import MicSelect from "../../components/webRTC/devices/MicSelect";
import SpeakerSelect from "../../components/webRTC/devices/SpeakerSelect";
import Timer from "../../components/webRTC/Timer";
import timer from "../../components/webRTC/timerfunction";
import getVideoConstraints from "../../components/webRTC/getVideoConstraints";
import styles from "../../scss/web-conference/mainComponent.module.scss";
import SockJS from "sockjs-client";
import { WEBRTC_URL } from "../../config";
import { getStudyResume } from "../../api/resume";

function mapStateToProps(state) {
  return {
    wsSocket: state.wsReducer.ws,
    myIdName: `${state.userReducer.user.id}-${state.userReducer.user.nickName}`, // id + - + nickName
    cameraId: state.videoReducer.cameraId,
    micId: state.videoReducer.micId,
    speakerId: state.videoReducer.speakerId,
    user: state.userReducer.user,
  };
}
export default connect(mapStateToProps, null)(Conference);
function Conference({ wsSocket, myIdName, cameraId, micId, speakerId, user }) {
  const [me, setMe] = useState(null);
  const [mode, setMode] = useState(false); // 면접모드 true, 일반모드 false
  const [volunteer, setVolunteer] = useState("");
  const [screenShareTry, setScreenShareTry] = useState(false);
  const [screenShare, setScreenShare] = useState(false);
  const [screenShareUser, setScreenShareUser] = useState("");
  const [screenCompatibility, setScreenCompatibility] = useState(false);

  const [isCamera, setIsCamera] = useState(true);
  const [isMic, setIsMic] = useState(true);
  const [isSpeaker, setIsSpeaker] = useState(true);

  const [isChat, setIsChat] = useState(true);
  const isChatTrue = useRef();
  const isChatFalse = useRef();

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
    const roomName = router.query.roomName;
    const myName = myIdName.slice(1 + myIdName.search("-"), myIdName.length);
    let meState = null;
    // 새로고침 로직 다른거 생각중
    let ws = wsSocket;
    if (!ws) {
      alert("잘못된 접근입니다.");
      ws = {};
      ws.send = function () {};
      ws.close = function () {};
      window.location.href = "/404";
      // router.push("/404")
    }
    let participants = {};

    function Participant(idName, isCam) {
      let rtcPeer;
      const idx = idName.search("-");
      this.id = idName.slice(0, idx);
      this.name = idName.slice(1 + idx, idName.length);

      const container = document.createElement("span");
      container.id = idName;
      const span = document.createElement("span");
      span.innerText = this.name;
      const video = document.createElement("video");
      video.id = "video-" + idName;
      video.autoplay = true;
      video.controls = false;
      if (this.id === "screen") {
        video.style.height = "calc(60vh - 1.5rem)";
        video.style.width = "calc(106.667vh - 2.667rem)";
        video.style.maxHeight = "calc(675px - 15rem)";
        video.style.maxWidth = "calc(1200px - 26.667rem)";
        video.style.minHeight = "28.5rem";
        video.style.minWidth = "50.667rem";
      }

      video.style.border = "2px";
      video.style.borderStyle = "solid";
      video.style.backgroundColor = "black";
      if (video.sinkId !== speakerId) video.setSinkId(speakerId);
      container.appendChild(video);
      container.appendChild(span);
      container.style =
        "display: flex; flex-direction: column; align-items: center;";

      if (!isCam) {
        // pass
      } else if (this.id === "screen") {
        document.getElementById("screens").appendChild(container);
        span.innerText =
          this.name.slice(1 + this.name.search("-"), this.name.length) +
          "'s screen";
      } else {
        document.getElementById("participants").appendChild(container);
      }

      this.getElement = function () {
        return container;
      };
      this.getVideoElement = function () {
        return video;
      };
      if (isCam) {
        this.offerToReceiveVideo = function (error, offerSdp, wp) {
          if (error) return console.log(`ERROR! ${error}`);
          sendMessage({
            id: "receiveVideoFrom",
            sender: idName,
            sdpOffer: offerSdp,
          });
        };
      } else {
        this.offerToReceiveVideo = function (error, offerSdp, wp) {
          if (error) return console.log(`ERROR! ${error}`);
          screenMessage({
            id: "receiveVideoFrom",
            sender: idName,
            sdpOffer: offerSdp,
          });
        };
      }
      if (isCam) {
        this.onIceCandidate = function (candidate, wp) {
          sendMessage({
            id: "onIceCandidate",
            candidate: candidate,
            name: idName,
          });
        };
      } else {
        this.onIceCandidate = function (candidate, wp) {
          screenMessage({
            id: "onIceCandidate",
            candidate: candidate,
            name: idName,
          });
        };
      }
      this.dispose = function () {
        this.rtcPeer.dispose();
        container.parentNode.removeChild(container);
      };

      Object.defineProperty(this, "rtcPeer", { writable: true });
    }
    function sendMessage(message) {
      const jsonMessage = JSON.stringify(message);
      // console.log("Sending message: " + jsonMessage);
      ws.send(jsonMessage);
    }
    ws.onmessage = function (message) {
      const jsonMsg = JSON.parse(message.data);
      // console.log("Received message: " + message.data);
      switch (jsonMsg.id) {
        case "existingParticipants":
          if (
            jsonMsg.data.filter(
              (participant) => participant.slice(0, 6) !== "screen"
            ).length >= 4
          ) {
            alert("잘못된 접근입니다.");
            beforeunload();
            router.push("/404");
          }
          onExistingParticipants(jsonMsg);
          break;
        case "newParticipantArrived":
          if (
            jsonMsg.name.slice(0, 6) !== "screen" &&
            Object.keys(participants).filter(
              (participant) => participant.slice(0, 6) !== "screen"
            ).length >= 4
          )
            break;
          if (myIdName === screenShareAppliedUser) {
            sendMessage({
              id: "mode",
              position: screenShareTryState
                ? `screenShareTry`
                : `notScreenShareTry`,
            });
            if (screenShareState) {
              sendMessage({
                id: "mode",
                position: `screenShare`,
              });
            }
          }
          if (myIdName === volunteerUser) {
            sendMessage({
              id: "mode",
              position: "volunteer",
            });
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
          participants[jsonMsg.name].rtcPeer.addIceCandidate(
            jsonMsg.candidate,
            function (error) {
              if (error) return console.log(`ERROR! ${error}`);
            }
          );
          break;
        case "chat":
          onReceiveChat(jsonMsg);
          break;
        case "mode":
          onMode(jsonMsg);
          break;
        case "duplicateName":
          alert("이미 참가한 유저입니다.");
          window.close();
          break;
        default:
          console.log(`ERROR! ${jsonMsg}`);
      }
    };

    function onNewParticipant(jsonMsg) {
      receiveVideo(jsonMsg.name);
    }
    function receiveVideoResponse(jsonMsg) {
      participants[jsonMsg.name].rtcPeer.processAnswer(
        jsonMsg.sdpAnswer,
        function (error) {
          if (error) return console.log(`ERROR! ${error}`);
        }
      );
    }
    function onExistingParticipants(jsonMsg) {
      const participant = new Participant(myIdName, true);
      participants[myIdName] = participant;

      const options = {
        localVideo: participant.getVideoElement(),
        mediaConstraints: getVideoConstraints(480, 270),
        onicecandidate: participant.onIceCandidate.bind(participant),
      };
      participant.rtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(
        options,
        function (error) {
          if (error) return console.log(`ERROR! ${error}`);
          this.generateOffer(participant.offerToReceiveVideo.bind(participant));
        }
      );
      jsonMsg.data.forEach(receiveVideo);
      meState = participant;
      setMe(meState);
      screenCompatibility = !screenCompatibility;
      setScreenCompatibility(screenCompatibility);
    }

    function receiveVideo(senderIdName) {
      // if(senderIdName === "-screen") return receiveScreen(senderIdName);
      const participant = new Participant(senderIdName, true);
      participants[senderIdName] = participant;

      const options = {
        remoteVideo: participant.getVideoElement(),
        onicecandidate: participant.onIceCandidate.bind(participant),
      };

      participant.rtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(
        options,
        function (error) {
          if (error) return console.log(`ERROR! ${error}`);
          this.generateOffer(participant.offerToReceiveVideo.bind(participant));
        }
      );
      screenCompatibility = !screenCompatibility;
      setScreenCompatibility(screenCompatibility);
    }
    let screenCompatibility = false;

    function onParticipantLeft(jsonMsg) {
      const participant = participants[jsonMsg.name];
      participant.dispose();
      delete participants[jsonMsg.name];
      screenCompatibility = !screenCompatibility;
      setScreenCompatibility(screenCompatibility);
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
        screenShareTryState = false;
        setScreenShareTry(screenShareTryState);
        screenShareState = false;
        setScreenShare(screenShareState);
        screenShareAppliedUser = "";
        setScreenShareUser(screenShareAppliedUser);
        sendMessage({
          id: "mode",
          position: `notScreenShare`,
        });
        stream = null;
        screenMessage({
          id: "leaveRoom",
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
          video: {
            mandatory: { maxWidth: 320, maxFrameRate: 10, minFrameRate: 10 },
          },
        },
        onicecandidate: screen.onIceCandidate.bind(screen),
      };

      screen.rtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(
        options,
        function (error) {
          if (error) return console.log(`ERROR! ${error}`);
          this.generateOffer(screen.offerToReceiveVideo.bind(screen));
        }
      );
    }

    let screenShareAppliedUser = "";
    let volunteerUser = "";
    function onMode(jsonMsg) {
      if (jsonMsg.name !== myIdName) {
        switch (jsonMsg.position) {
          case "screenShareTry":
            screenShareAppliedUser = jsonMsg.name;
            screenShareTryState = true;
            break;
          case "notScreenShareTry":
            screenShareAppliedUser = jsonMsg.name;
            screenShareTryState = false;
            break;
          case "screenShare":
            screenShareAppliedUser = jsonMsg.name;
            screenShareState = true;
            screenShareTryState = true;
            break;
          case "notScreenShare":
            screenShareAppliedUser = "";
            screenShareState = false;
            screenShareTryState = false;
            break;
          case "normal":
            volunteerUser = "";
            modeState = false;
            timer.stopTimer();
            setIsChat(true);
            break;
          case "volunteer":
            volunteerUser = jsonMsg.name;
            modeState = true;
            timer.startTimer();
            break;
          default:
            console.log(`ERROR! ${jsonMsg.mode}`);
            break;
        }
        setScreenShareTry(screenShareTryState);
        setScreenShare(screenShareState);
        setScreenShareUser(screenShareAppliedUser);
        setVolunteer(volunteerUser);
        setMode(modeState);
      }
    }

    let stream;
    let screenWs;
    let screenHandler;
    let screenShareState = false;
    let screenShareTryState = false;
    async function startScreenShare() {
      if (modeState && volunteerUser !== myIdName) {
        const userName = volunteerUser.slice(
          volunteerUser.search("-") + 1,
          volunteerUser.length
        );
        alert(
          `면접 모드 상태입니다. \n${userName}님만 화면공유를 사용할 수 있습니다.`
        );
        return;
      }
      if (!stream) {
        screenWs = new SockJS(`${WEBRTC_URL}/groupcall`);
        screenShareTryState = true;
        sendMessage({
          id: "mode",
          position: `screenShareTry`,
        });
        screenHandler = new ScreenHandler();
        stream = await screenHandler.start();
        if (stream) {
          if (!screenShareState) {
            stream.oninactive = () => screenHandler.end();
            screenShareTryState = false;
            setScreenShareTry(screenShareTryState);
            screenShareState = true;
            setScreenShare(screenShareState);
            screenShareAppliedUser = myIdName;
            setScreenShareUser(screenShareAppliedUser);
            sendMessage({
              id: "mode",
              position: `screenShare`,
            });
            screenMessage({
              id: "joinRoom",
              name: `screen-${myIdName}`,
              room: roomName,
            });
            screenWs.onmessage = function (message) {
              const jsonMsg = JSON.parse(message.data);
              // console.log("Received message: " + message.data);
              switch (jsonMsg.id) {
                case "existingParticipants":
                  existingScreens(jsonMsg);
                  break;
                case "newParticipantArrived":
                  break;
                case "participantLeft":
                  break;
                case "receiveVideoAnswer":
                  screen.rtcPeer.processAnswer(
                    jsonMsg.sdpAnswer,
                    function (error) {
                      if (error) return console.log(`ERROR! ${error}`);
                    }
                  );
                  break;
                case "iceCandidate":
                  screen.rtcPeer.addIceCandidate(
                    jsonMsg.candidate,
                    function (error) {
                      if (error) return console.log(`ERROR! ${error}`);
                    }
                  );
                  break;
                case "chat":
                  break;
                case "mode":
                  break;
                default:
                  console.log(`ERROR! ${jsonMsg}`);
              }
            };
          } else {
            alert("화면은 한 명만 공유 가능합니다.");
          }
        } else {
          screenShareTryState = false;
          sendMessage({
            id: "mode",
            position: `notScreenShareTry`,
          });
          screenWs.close();
        }
      } else {
        screenHandler.end();
      }
    }

    const chatContentBoxEl = chatContentBox.current;
    function onReceiveChat(jsonMsg) {
      const senderIdName = jsonMsg.sessionName;
      const senderName = senderIdName.slice(
        1 + senderIdName.search("-"),
        senderIdName.length
      );
      const showingMsg = `${senderName}: ${jsonMsg.contents}`;
      const name = document.createElement("h4");
      name.innerText = senderName + "\u00a0";
      name.style.display = "inline";
      const text = document.createElement("p");
      text.innerText = `${jsonMsg.contents}`;
      text.style.display = "inline";
      const showingMsgElContainer = document.createElement("div");
      const showingMsgEl = document.createElement("div");
      showingMsgEl.classList.add(
        user.nickName === senderName ? `${styles.me}` : `${styles.others}`
      );
      showingMsgEl.appendChild(name);
      showingMsgEl.appendChild(text);
      showingMsgElContainer.appendChild(showingMsgEl);
      chatContentBoxEl.appendChild(showingMsgElContainer);
      chatContentBoxEl.scrollTop = chatContentBoxEl.scrollHeight;
    }

    function sendChatMsg() {
      const chatMsg = chatInputEl.value.trim();
      if (chatMsg) {
        sendMessage({
          id: "chat",
          contents: chatMsg,
        });
      }
      chatInputEl.value = "";
    }
    function enterInput(event) {
      switch (event.key) {
        case "Enter":
          event.preventDefault();
          sendChatMsg();
          break;
        default:
          break;
      }
    }
    const chatInputEl = chatInput.current;
    const chatInputBtnEl = chatInputBtn.current;
    chatInputBtnEl.addEventListener("click", sendChatMsg);
    chatInputEl.addEventListener("keypress", enterInput);
    function setIsChatTrue() {
      setIsChat(true);
    }
    function setIsChatFalse() {
      setIsChat(false);
      const userId = volunteerUser.slice(0, volunteerUser.search("-"));
      if (!isNaN(userId)) {
        const letterEl = document.getElementById("letter");
        getStudyResume(
          { userId, studyId: roomName },
          (res) => {
            if (res.data.response.length !== 0) {
              const resumeList = res.data.response[0].resumeQuestionList;
              const contents = document.createElement("span");
              resumeList.forEach((resume) => {
                const h3 = document.createElement("h3");
                h3.innerText = resume.question;
                contents.appendChild(h3);
                const p = document.createElement("p");
                p.innerText = resume.answer;
                contents.appendChild(p);
                const br = document.createElement("br");
                contents.appendChild(br);
              });
              letterEl.innerHTML = "";
              letterEl.appendChild(contents);
            } else {
              const h2 = document.createElement("h2");
              h2.innerText = "등록된 자기소개서가 없습니다.";
              letterEl.innerHTML = "";
              letterEl.appendChild(h2);
            }
          },
          (err) => {
            console.log(`자소서 불러오기 실패! ${err}`);
          }
        );
      }
    }
    const isChatTrueEl = isChatTrue.current;
    const isChatFalseEl = isChatFalse.current;
    isChatTrueEl.addEventListener("click", setIsChatTrue);
    isChatFalseEl.addEventListener("click", setIsChatFalse);

    const cameraBtnEl = cameraBtn.current;
    const micBtnEl = micBtn.current;
    const speakerBtnEl = speakerBtn.current;
    const screenBtnEl = screenBtn.current;
    const changeModeBtnEl = changeModeBtn.current;
    const exitBtnEl = exitBtn.current;

    let isCameraState = true;
    let isMicState = true;
    let isSpeakerState = true;
    function cameraSelectToggle() {
      isCameraState = !isCameraState;
      setIsCamera(isCameraState);
    }
    function micSelectToggle() {
      isMicState = !isMicState;
      setIsMic(isMicState);
    }
    function speakerSelectToggle() {
      isSpeakerState = !isSpeakerState;
      setIsSpeaker(isSpeakerState);
    }
    cameraBtnEl.addEventListener("click", cameraSelectToggle);
    micBtnEl.addEventListener("click", micSelectToggle);
    speakerBtnEl.addEventListener("click", speakerSelectToggle);

    function exitRoom() {
      if (confirm("정말 나가시겠습니까?")) {
        window.close();
      }
    }
    exitBtnEl.addEventListener("click", exitRoom);

    let modeState = false;
    function changeMode() {
      if (screenShareAppliedUser && screenShareAppliedUser !== myIdName) {
        const userName = screenShareAppliedUser.slice(
          screenShareAppliedUser.search("-") + 1,
          screenShareAppliedUser.length
        );
        if (screenShareState) {
          alert(`${userName}님이 화면 공유 중입니다.`);
        } else {
          alert(`${userName}님이 화면 공유 준비 중입니다.`);
        }
        return;
      }
      if (modeState) {
        if (!confirm("일반 모드로 바꾸시겠습니까?")) return;
        setIsChat(true);
        timer.stopTimer();
      } else {
        if (!confirm("면접 모드로 바꾸시겠습니까?")) return;
        timer.startTimer();
      }
      modeState = !modeState;
      if (modeState) {
        volunteerUser = myIdName;
      } else {
        volunteerUser = "";
      }
      setVolunteer(volunteerUser);
      setMode(modeState);
      sendMessage({
        id: "mode",
        position: modeState ? "volunteer" : "normal",
      });
    }
    changeModeBtnEl.addEventListener("click", changeMode);
    screenBtnEl.addEventListener("click", startScreenShare);
    // 방 입장
    sendMessage({
      id: "joinRoom",
      name: myIdName,
      room: roomName,
    });

    function beforeunload() {
      if (stream) {
        sendMessage({
          id: "mode",
          position: `notScreenShare`,
        });
        screenMessage({
          id: "leaveRoom",
        });
        screenWs.close();
      }
      sendMessage({
        id: "leaveRoom",
      });
      ws.close();
      for (let key in participants) {
        participants[key].dispose();
      }
    }
    window.addEventListener("beforeunload", beforeunload);

    return () => {
      chatInputBtnEl.removeEventListener("click", sendChatMsg);
      chatInputEl.removeEventListener("keypress", enterInput);
      screenBtnEl.removeEventListener("click", startScreenShare);
      cameraBtnEl.removeEventListener("click", cameraSelectToggle);
      micBtnEl.removeEventListener("click", micSelectToggle);
      speakerBtnEl.removeEventListener("click", speakerSelectToggle);
      exitBtnEl.removeEventListener("click", exitRoom);
      isChatTrueEl.removeEventListener("click", setIsChatTrue);
      isChatFalseEl.removeEventListener("click", setIsChatFalse);
      // 방 퇴장
      window.removeEventListener("beforeunload", beforeunload);
      beforeunload();
    };
  }, []);

  useEffect(async () => {
    if (me) {
      const newStream = await navigator.mediaDevices.getUserMedia(
        getVideoConstraints(480, 270)
      );
      const videoSender = me.rtcPeer.peerConnection
        .getSenders()
        .find((sender) => sender.track.kind === "video");
      const audioSender = me.rtcPeer.peerConnection
        .getSenders()
        .find((sender) => sender.track.kind === "audio");
      videoSender.replaceTrack(newStream.getVideoTracks()[0]);
      audioSender.replaceTrack(newStream.getAudioTracks()[0]);
      me.getVideoElement().srcObject = newStream;
    }
  }, [cameraId, micId]);
  useEffect(() => {
    if (me) {
      const videoSender = me.rtcPeer.peerConnection
        .getSenders()
        .find((sender) => sender.track.kind === "video");
      const audioSender = me.rtcPeer.peerConnection
        .getSenders()
        .find((sender) => sender.track.kind === "audio");
      videoSender.track.enabled = isCamera;
      audioSender.track.enabled = isMic;
    }
  }, [isCamera, isMic]);

  useEffect(() => {
    for (let container of document.querySelector("#participants").children) {
      const video = container.firstChild;
      if (video.sinkId !== speakerId) video.setSinkId(speakerId);
    }
    for (let container of document.querySelector("#screens").children) {
      const video = container.firstChild;
      if (video.sinkId !== speakerId) video.setSinkId(speakerId);
    }
  }, [speakerId]);
  useEffect(() => {
    if (isSpeaker) {
      for (let container of document.querySelector("#participants").children) {
        if (container.id === myIdName) {
          const video = container.firstChild;
          video.muted = true;
          continue;
        }
        const video = container.firstChild;
        video.muted = false;
      }
      if (document.querySelector("#screens").firstChild)
        document.querySelector("#screens").firstChild.firstChild.muted = false;
    } else {
      for (let container of document.querySelector("#participants").children) {
        const video = container.firstChild;
        video.muted = true;
      }
      if (document.querySelector("#screens").firstChild)
        document.querySelector("#screens").firstChild.firstChild.muted = true;
    }
  }, [isSpeaker, screenCompatibility]);

  useEffect(() => {
    const participantsEl = document.getElementById("participants");
    for (let videoContainer of participantsEl.childNodes) {
      const video = videoContainer.firstChild;
      if (video.id === `video-${screenShareUser}`) {
        video.style.border = "2px";
        video.style.borderStyle = "solid";
        video.style.borderColor = "#6bbfca";
        video.style.backgroundColor = "#6bbfca";
      } else {
        video.style.border = "1px";
        video.style.borderStyle = "solid";
        video.style.borderColor = "black";
        video.style.backgroundColor = "black";
      }
    }
  }, [screenShareUser]);

  useEffect(() => {
    document.getElementById("videoContainer").style.flexDirection = "column";
    document.getElementById("participants").style.width = "calc(90vw - 24rem)";
    if (mode) {
      if (myIdName === volunteer) {
        if (screenShare) {
          const participantsEl = document.getElementById("participants");
          for (let videoContainer of participantsEl.childNodes) {
            const video = videoContainer.firstChild;
            videoContainer.style.marginRight = "1rem";
            if (videoContainer.id === volunteer) {
              videoContainer.style.display = "none";
            }
            video.style.width = "calc(35.556vh - 3.556rem)";
            video.style.height = "calc(20vh - 2rem)";
            video.style.maxHeight = "calc(19.688vh - 2.344rem)";
            video.style.maxWidth = "calc(35vh - 4.16rem)";
            video.style.minHeight = "8.5rem";
            video.style.minWidth = "15.111rem";
            video.style.borderRadius = "7px";
          }
          document.getElementById("videoContainer").style.flexDirection = "row";
          document.getElementById("participants").style.width =
            "calc(35.556vh - 3.556rem)";
        } else {
          const participantsEl = document.getElementById("participants");
          let inteviewerNum = participantsEl.childNodes.length - 1;
          if (inteviewerNum > 2) inteviewerNum = 2;
          for (let videoContainer of participantsEl.childNodes) {
            const video = videoContainer.firstChild;
            videoContainer.style.marginRight = "1rem";
            if (videoContainer.id === volunteer) {
              videoContainer.style.display = "none";
            }
            video.style.width = `calc((90vw - 24rem - 2rem) / ${inteviewerNum})`;
            video.style.height = `calc((90vw - 24rem - 2rem) * 9 / 16 / ${inteviewerNum})`;
            video.style.maxHeight = `calc(38.5rem / ${inteviewerNum})`;
            video.style.maxWidth = `calc(68.444rem / ${inteviewerNum})`;
            video.style.minHeight = `calc(459px / ${inteviewerNum})`;
            video.style.minWidth = `calc(816px / ${inteviewerNum})`;
            video.style.borderRadius = "7px";
          }
        }
      } else {
        if (screenShare) {
          const participantsEl = document.getElementById("participants");
          for (let videoContainer of participantsEl.childNodes) {
            const video = videoContainer.firstChild;
            videoContainer.style.marginRight = "1rem";
            if (videoContainer.id !== volunteer) {
              videoContainer.style.display = "none";
            }
            video.style.width = "calc(35.556vh - 3.556rem)";
            video.style.height = "calc(20vh - 2rem)";
            video.style.maxHeight = "calc(19.688vh - 2.344rem)";
            video.style.maxWidth = "calc(35vh - 4.16rem)";
            video.style.minHeight = "8.5rem";
            video.style.minWidth = "15.111rem";
            video.style.borderRadius = "7px";
          }
        } else {
          const participantsEl = document.getElementById("participants");
          for (let videoContainer of participantsEl.childNodes) {
            const video = videoContainer.firstChild;
            videoContainer.style.marginRight = "1rem";
            if (videoContainer.id !== volunteer) {
              videoContainer.style.display = "none";
            }
            video.style.width = "calc((90vw - 24rem - 2rem))";
            video.style.height = "calc((90vw - 24rem - 2rem) * 9 / 16)";
            video.style.maxHeight = "38.5rem";
            video.style.maxWidth = "68.444rem";
            video.style.minHeight = "459px";
            video.style.minWidth = "816px";
            video.style.borderRadius = "7px";
          }
        }
      }
    } else {
      if (screenShare) {
        const participantsEl = document.getElementById("participants");
        for (let videoContainer of participantsEl.childNodes) {
          const video = videoContainer.firstChild;
          videoContainer.style.display = "flex";
          videoContainer.style.marginRight = "1rem";
          video.style.width = "calc(35.556vh - 3.556rem)";
          video.style.height = "calc(20vh - 2rem)";
          video.style.maxHeight = "calc(19.688vh - 2.344rem)";
          video.style.maxWidth = "calc(35vh - 4.16rem)";
          video.style.minHeight = "8.5rem";
          video.style.minWidth = "15.111rem";
          video.style.borderRadius = "7px";
        }
      } else {
        const participantsEl = document.getElementById("participants");
        for (let videoContainer of participantsEl.childNodes) {
          const video = videoContainer.firstChild;
          videoContainer.style.display = "flex";
          videoContainer.style.marginRight = "1rem";
          video.style.width = "calc((90vw - 24rem - 2rem) / 2)";
          video.style.height = "calc((90vw - 24rem - 2rem) * 9 / 32)";
          video.style.maxHeight = "calc(40vh - 1.5rem)";
          video.style.maxWidth = "calc(71.111vh - 2.667rem";
          video.style.minHeight = "8.5rem";
          video.style.minWidth = "15.111rem";
          video.style.borderRadius = "7px";
        }
      }
    }
  }, [mode, screenShare, volunteer, screenCompatibility]);

  return (
    <div className={styles.container}>

      <div className={styles.mainContainer}>
        <div className={styles.mainSection}>
          <div id="videoContainer" className={styles.videoContainer}>
            <div className={styles.screens} id="screens"></div>
            <div className={styles.faces} id="participants"></div>
          </div>

          <div className={styles.btnBar}>
            <div className={styles.eachBtn}>
              <span ref={cameraBtn}>
                <span style={isCamera ? {} : { display: "none" }}>
                  <div className={styles.iconBox}>
                    <i className="fas fa-video"></i>
                  </div>
                  <span>비디오 끄기</span>
                </span>

                <span style={!isCamera ? {} : { display: "none" }}>
                  <div className={styles.iconBox}>
                    <i class="fas fa-video-slash"></i>
                  </div>
                  <span>비디오 켜기</span>
                </span>
              </span>

              <CameraSelect />
            </div>

            <div className={styles.eachBtn}>
              <span ref={micBtn}>
                <span style={isMic ? {} : { display: "none" }}>
                  <div className={styles.iconBox}>
                    <i className="fas fa-microphone"></i>
                  </div>
                  <span>마이크 끄기</span>
                </span>

                <span style={!isMic ? {} : { display: "none" }}>
                  <div className={styles.iconBox}>
                    <i class="fas fa-microphone-slash"></i>
                  </div>
                  <span>마이크 켜기</span>
                </span>
              </span>

              <MicSelect />
            </div>

            <div className={styles.eachBtn}>
              <span ref={speakerBtn}>
                <span style={isSpeaker ? {} : { display: "none" }}>
                  <div className={styles.iconBox}>
                    <i className="fas fa-volume-up"></i>
                  </div>
                  <span>음소거</span>
                </span>

                <span style={!isSpeaker ? {} : { display: "none" }}>
                  <div className={styles.iconBox}>
                    <i class="fas fa-volume-mute"></i>
                  </div>
                  <span>음소거 해제</span>
                </span>
              </span>

              <SpeakerSelect />
            </div>

            <div className={styles.eachBtn}>
              <span>
                <span
                  style={screenShareTry ? { display: "none" } : {}}
                  ref={screenBtn}
                >
                  <div className={styles.iconBox}>
                    <i className="fas fa-chalkboard"></i>
                  </div>
                  <span>화면 공유</span>
                </span>
              </span>

              <span>
                <span
                  style={!screenShareTry ? { display: "none" } : {}}
                  className={styles.nonCursor}
                >
                  <div className={styles.iconBox}>
                    <i className="fas fa-chalkboard-teacher"></i>
                  </div>
                  <span>화면 공유 종료</span>
                </span>
              </span>
            </div>

            <div className={styles.eachBtn} ref={changeModeBtn}>
              <span>
                <span style={mode ? { display: "none" } : {}}>
                  <div className={styles.iconBox}>
                    <i className="fas fa-user-tie"></i>
                  </div>
                  <span>면접 모드</span>
                </span>
              </span>

              <span>
                <span style={!mode ? { display: "none" } : {}}>
                  <div className={styles.iconBox}>
                    <i className="fas fa-users"></i>
                  </div>
                  <span>일반 모드</span>
                </span>
              </span>
            </div>

            <div className={styles.eachBtn} ref={exitBtn}>
              <span>
                <span>
                  <div className={styles.iconBox}>
                    <i className="fas fa-times"></i>
                  </div>
                  <span>종료</span>
                </span>
              </span>
            </div>
          </div>
        </div>

        <div
          style={volunteer === myIdName ? { display: "none" } : {}}
          className={styles.subContainer}
        >
          <div className={styles.subContainerTopBar}>
            <div className={styles.header}>
              <span
                className={`${styles.chatMenuBtn} + " " + ${
                  isChat ? styles.selectedMenuBtn : ""
                }`}
                ref={isChatTrue}
              >
                채팅
              </span>

              <span
                style={mode ? {} : { display: "none" }}
                className={`${styles.letterMenuBtn} + " " + ${
                  !isChat ? styles.selectedMenuBtn : ""
                }`}
                ref={isChatFalse}
              >
                자소서
              </span>
            </div>

            <span
              style={mode ? {} : { display: "none" }}
              className={styles.timer}
            >
              <Timer />
            </span>
          </div>

          <div
            style={isChat ? {} : { display: "none" }}
            className={styles.chatContainer}
            id="chat"
          >
            <div ref={chatContentBox} className={styles.chat}></div>

            <div className={styles.chatInput}>
              <input ref={chatInput} placeholder="메시지를 입력하세요..." />
              <button ref={chatInputBtn}>
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>

          <div
            style={!isChat ? {} : { display: "none" }}
            className={styles.letterContainer}
          >
            <pre className={styles.letter} id="letter"></pre>
          </div>
        </div>
      </div>
    </div>
  );
}
