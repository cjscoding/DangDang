import { useEffect, useState } from "react";
import { connect } from "react-redux";
import SockJS from "sockjs-client";
import WebRtcPeer from "kurento-utils";
// import Participant from "../../webRTC/Participant"
import { WEBRTC_URL } from "../../config"
import MyFace from "../../components/webRTC/MyFace";

function mapStateToProps(state) {
  const date = new Date();
  const dateStr = date.toTimeString()
  return {
    cameraId: state.videoReducer.cameraId, 
    micId: state.videoReducer.micId,
    speakerId: state.videoReducer.speakerId,
    roomName: 1,
    myName: dateStr,
  };
}
export default connect(mapStateToProps)(Conference);
function Conference({cameraId, micId, speakerId, roomName, myName}) {
  useEffect(() => {
    const PARTICIPANT_MAIN_CLASS = 'participant main';
    const PARTICIPANT_CLASS = 'participant';
    function Participant(name) {
      this.name = name;
      var container = document.createElement('div');
      container.className = isPresentMainParticipant() ? PARTICIPANT_CLASS : PARTICIPANT_MAIN_CLASS;
      container.id = name;
      var span = document.createElement('span');
      var video = document.createElement('video');
      var rtcPeer;
    
      container.appendChild(video);
      container.appendChild(span);
      container.onclick = switchContainerClass;
      document.getElementById('participants').appendChild(container);
    
      span.appendChild(document.createTextNode(name));
    
      video.id = 'video-' + name;
      video.autoplay = true;
      video.controls = false;
    
    
      this.getElement = function() {
        return container;
      }
    
      this.getVideoElement = function() {
        return video;
      }
    
      function switchContainerClass() {
        if (container.className === PARTICIPANT_CLASS) {
          var elements = Array.prototype.slice.call(document.getElementsByClassName(PARTICIPANT_MAIN_CLASS));
          elements.forEach(function(item) {
              item.className = PARTICIPANT_CLASS;
          });
          container.className = PARTICIPANT_MAIN_CLASS;
        } else {
          container.className = PARTICIPANT_CLASS;
        }
      }
    
      function isPresentMainParticipant() {
        return ((document.getElementsByClassName(PARTICIPANT_MAIN_CLASS)).length != 0);
      }
    
      this.offerToReceiveVideo = function(error, offerSdp, wp){
        if (error) return console.error ("sdp offer error")
        console.log('Invoking SDP offer callback function');
        var msg =  { id : "receiveVideoFrom",
            sender : name,
            sdpOffer : offerSdp
          };
        sendMessage(msg);
      }
    
    
      this.onIceCandidate = function (candidate, wp) {
          console.log("Local candidate" + JSON.stringify(candidate));
    
          var message = {
            id: 'onIceCandidate',
            candidate: candidate,
            name: name
          };
          sendMessage(message);
      }
    
      Object.defineProperty(this, 'rtcPeer', { writable: true});
    
      this.dispose = function() {
        console.log('Disposing participant ' + this.name);
        this.rtcPeer.dispose();
        container.parentNode.removeChild(container);
      };
    }
  
    var ws = new SockJS(`${WEBRTC_URL}/groupcall`);
    var participants = {};
    var name;
    
    ws.onmessage = function(message) {
      var parsedMessage = JSON.parse(message.data);
      console.info('Received message: ' + message.data);
    
      switch (parsedMessage.id) {
      case 'existingParticipants':
        onExistingParticipants(parsedMessage);
        break;
      case 'newParticipantArrived':
        onNewParticipant(parsedMessage);
        break;
      case 'participantLeft':
        onParticipantLeft(parsedMessage);
        break;
      case 'receiveVideoAnswer':
        receiveVideoResponse(parsedMessage);
        break;
      case 'iceCandidate':
        participants[parsedMessage.name].rtcPeer.addIceCandidate(parsedMessage.candidate, function (error) {
              if (error) {
              console.error("Error adding candidate: " + error);
              return;
              }
          });
          break;
      default:
        console.error('Unrecognized message', parsedMessage);
      }
    }
    
    function register() {
      name = myName;
      var room = roomName;
    
      // document.getElementById('room-header').innerText = 'ROOM ' + room;
      // document.getElementById('join').style.display = 'none';
      // document.getElementById('room').style.display = 'block';
    
      var message = {
        id : 'joinRoom',
        name : name,
        room : room,
      }
      sendMessage(message);
    }
    
    function onNewParticipant(request) {
      receiveVideo(request.name);
    }
    
    function receiveVideoResponse(result) {
      participants[result.name].rtcPeer.processAnswer (result.sdpAnswer, function (error) {
        if (error) return console.error (error);
      });
    }
    
    function callResponse(message) {
      if (message.response != 'accepted') {
        console.info('Call not accepted by peer. Closing call');
        stop();
      } else {
        webRtcPeer.processAnswer(message.sdpAnswer, function (error) {
          if (error) return console.error (error);
        });
      }
    }
    function onExistingParticipants(msg) {
      const initialConstraints = { width: 320, height: 180, facingMode: "user" };
      const cameraConstraints = {video: {...initialConstraints, deviceId: {exact: cameraId}}};
      const micConstraints = {audio: {deviceId: {exact: micId}}};
      var constraints = {
        audio: true,
        ...micId?micConstraints:{},
        video: initialConstraints,
        ...cameraId?cameraConstraints:{},
      };
      console.log(name + " registered in room " + roomName);
      var participant = new Participant(name);
      participants[name] = participant;
      var video = participant.getVideoElement();
    
      var options = {
        localVideo: video,
        mediaConstraints: constraints,
        onicecandidate: participant.onIceCandidate.bind(participant)
      }
      participant.rtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(options,
        function (error) {
          if(error) {
            return console.error(error);
          }
          this.generateOffer (participant.offerToReceiveVideo.bind(participant));
      });
    
      msg.data.forEach(receiveVideo);
    }
    
    function leaveRoom() {
      sendMessage({
        id : 'leaveRoom'
      });
    
      for ( var key in participants) {
        participants[key].dispose();
      }
    
      document.getElementById('join').style.display = 'block';
      document.getElementById('room').style.display = 'none';
    
      ws.close();
    }
    
    function receiveVideo(sender) {
      var participant = new Participant(sender);
      participants[sender] = participant;
      var video = participant.getVideoElement();
    
      var options = {
          remoteVideo: video,
          onicecandidate: participant.onIceCandidate.bind(participant)
        }
    
      participant.rtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(options,
          function (error) {
            if(error) {
              return console.error(error);
            }
            this.generateOffer (participant.offerToReceiveVideo.bind(participant));
      });;
    }
    
    function onParticipantLeft(request) {
      console.log('Participant ' + request.name + ' left');
      var participant = participants[request.name];
      participant.dispose();
      delete participants[request.name];
    }
    
    function sendMessage(message) {
      var jsonMessage = JSON.stringify(message);
      console.log('Sending message: ' + jsonMessage);
      ws.send(jsonMessage);
    }
    setTimeout(()=>{
      register()
    }, 1000)
    return () => {
      ws.close()
    }
  }, [])
  return <div>
    <div id="participants"></div>
  </div>
}

// function Conference({roomName, myName}) {
//   let participants = {};
//   const [videos, setVideos] = useState([]);
//   useEffect(() => {
//     function Participant(name) {
//       this.name = name;
//       // let video = document.createElement("video");
//       // video.autoplay = true;
//       // video.controls = false;
//       let rtcPeer;
    
//       this.getVideo = function() {
//         return <MyFace />;
//       }
//       this.offerToReceiveVideo = (error, offerSdp, wp) => {
//         sendmessage({
//           id: "receiveVideoFrom",
//           sender: this.name,
//           sdpOffer: offerSdp,
//         });
//       };
//       this.onIceCandidate = (candidate, wp) => {
//         sendmessage({
//           id: "onIceCandidate",
//           candidate,
//           name: this.name,
//         });
//       };
//       this.dispose = () => {
//         this.rtcPeer.dispose();
//         // 요소에서도 삭제해야함.
//       }
//     }
//     const ws = new SockJS(`${WEBRTC_URL}/groupcall`);
//     function sendmessage(json) {
//       const stringMsg = JSON.stringify(json);
//       console.log(`Send Msg! ${stringMsg}`)
//       ws.send(stringMsg);
//     }

//     setTimeout(()=>{
//       sendmessage({
//         id: 'joinRoom',
//         name: myName,
//         room: roomName,
//       })
//     },3000)
//     // sendmessage({
//     //   id: 'joinRoom',
//     //   name: myName,
//     //   room: roomName,
//     // })
//     ws.onmessage = function(msg) {
//       console.log(msg)
//       const json = JSON.parse(msg.data)
//       switch(json.id) {
//         case 'existingParticipants':
//           onExistingParticipants(json);
//           break;
//         case "newParticipantArrived":
//           onNewParticipant(json);
//           break;
//         case "participantLeft":
//           onParticipantLeft(json);
//           break;
//         case "receiveVideoAnswer":
//           onReceiveVideoAnswer(json);
//           break;
//         case 'iceCandidate':
//           participants[json.name].rtcPeer.addIceCandidate(json.candidate, function (error) {
//             if (error) {
//             console.log(`ERROR! ${error}`);
//             return;
//             }
//           });
//           break;
//         default:
//           console.log(`ERROR! ${msg.data}`)
//       }
//     };
//     function onExistingParticipants(json) {
//       const constraints = {
//         audio: true,
//         video: {
//           mandatory : {
//             maxWidth : 320,
//             maxFrameRate : 15,
//             minFrameRate : 15,
//           },
//         },
//       };
//       const participant = new Participant(myName);
//       participants[myName] = participant
//       const options = {
//         localVideo: participant.getVideo(),
//         mediaConstraints: constraints,
//         onicecandidate: participant.onIceCandidate,
//       };
//       participant.rtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(options, function(error) {
//         if(error) return console.log(`ERROR! ${error}`)
//         this.generateOffer(participant.offerToReceiveVideo);
//       });
//       json.data.forEach(name => receiveVideo(name))
//     }
//     function onNewParticipant(json) {
//       receiveVideo(json.name)
//     }
//     function receiveVideo(other) {
//       const participant = new Participant(other);
//       participants[other] = participant
//       const options = {
//         remoteVideo: participant.getVideo(),
//         onicecandidate: participant.onIceCandidate,
//       };
//       participant.rtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(options, function(error) {
//         if(error) return console.log(`ERROR! ${error}`);
//         this.generateOffer(participant.offerToReceiveVideo);
//       });
//     }
//     function onParticipantLeft(json){
//       participants[json.name].dispose();
//     }
//     function onReceiveVideoAnswer(json){
//       participants[json.name].rtcPeer.processAnswer(json.sdpAnswer, function(error) {
//         if(error) return console.log(`ERROR! ${error}`);
//       })
//     }

//     // 메시지 보내기

//     // 방나갈때
//     return () => {
//       sendmessage({
//         id: "leaveRoom",
//       })
//       for(const name in participants) {
//         participants[name].dispose();
//       }
//       ws.close();
//     }
//   }, [])

//   // useEffect(() => {
//     // const list = Object.keys(participants).map(name => {
//     //   console.log(participants[name].rtcPeer.getLocalStream())
//     //   return participants[name].getVideo()
//     // })
//   //   setVideos(list)
//   // }, [participants])
//   return <div>
//     {/* <div><MyFace id="my-video" /></div> */}
//     <div>{Object.keys(participants).map(name => (
//       <h2>{JSON.stringify(participants[name].rtcPeer)}</h2>
//     ))}</div>
//   </div>
// }
// participants[name].getVideo())