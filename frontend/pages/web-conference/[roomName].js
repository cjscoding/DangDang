import { useRouter } from "next/router";
import { useEffect } from "react";
import { connect } from "react-redux";
import getVideoConstraints from "../../components/webRTC/getVideoConstraints";

function mapStateToProps(state) {
  const strId = String(state.userReducer.user.id)
  return {
    ws: state.wsReducer.ws,
    myIdName: `${strId.length}${strId}${state.userReducer.user.nickName}`, // id길이 + id + nickName
  };
}
export default connect(mapStateToProps)(Conference);
function Conference({ws, myIdName}) {
  const router = useRouter();
  useEffect(() => {
    const roomName = router.query.roomName
    // 새로고침 로직 다른거 생각중
    if(!ws) window.close();
    let participants = {};

    function Participant(myIdName) {
      let rtcPeer;
      const idLen = parseInt(myIdName.slice(0, 1))
      this.id = myIdName.slice(1, 1 + idLen)
      this.name = myIdName.slice(1 + idLen, myIdName.length);

      const container = document.createElement('span');
      container.id = myIdName;
      const span = document.createElement('span');
      span.innerText = this.name
      const video = document.createElement('video');
      video.id = 'video-' + myIdName;
      video.autoplay = true;
      video.controls = false;
      container.appendChild(video);
      container.appendChild(span);
      container.style = "display: flex; flex-direction: column; align-items: center;"

      document.getElementById('participants').appendChild(container);
    
      this.getElement = function() {
        return container;
      }
      this.getVideoElement = function() {
        return video;
      }

      this.offerToReceiveVideo = function(error, offerSdp, wp){
        if (error) return console.log(`ERROR! ${error}`)
        sendMessage({ id : "receiveVideoFrom",
        sender : myIdName,
        sdpOffer : offerSdp
      });
      }
      this.onIceCandidate = function (candidate, wp) {
        sendMessage({
          id: 'onIceCandidate',
          candidate: candidate,
          name: myIdName
        });
      }
      this.dispose = function() {
        this.rtcPeer.dispose();
        container.parentNode.removeChild(container);
      };

      Object.defineProperty(this, 'rtcPeer', { writable: true});
    }


    function sendMessage(message) {
      const jsonMessage = JSON.stringify(message);
      console.log('Sending message: ' + jsonMessage);
      ws.send(jsonMessage);
    }
    ws.onmessage = function(message) {
      const jsonMsg = JSON.parse(message.data);
      console.log('Received message: ' + message.data);
    
      switch (jsonMsg.id) {
      case 'existingParticipants':
        onExistingParticipants(jsonMsg);
        break;
      case 'newParticipantArrived':
        onNewParticipant(jsonMsg);
        break;
      case 'participantLeft':
        onParticipantLeft(jsonMsg);
        break;
      case 'receiveVideoAnswer':
        receiveVideoResponse(jsonMsg);
        break;
      case 'iceCandidate':
        participants[jsonMsg.name].rtcPeer.addIceCandidate(jsonMsg.candidate, function (error) {
          if (error) return console.log(`ERROR! ${error}`);
        });
        break;
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
      const participant = new Participant(myIdName);
      participants[myIdName] = participant;
    
      const options = {
        localVideo: participant.getVideoElement(),
        mediaConstraints: getVideoConstraints(480, 270),
        onicecandidate: participant.onIceCandidate.bind(participant)
      }
      participant.rtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(options, function(error) {
        if(error) return console.log(`ERROR! ${error}`);
        this.generateOffer (participant.offerToReceiveVideo.bind(participant));
      });
      jsonMsg.data.forEach(receiveVideo);
    }
    
    function receiveVideo(senderIdName) {
      const participant = new Participant(senderIdName);
      participants[senderIdName] = participant;

      const options = {
        remoteVideo: participant.getVideoElement(),
        onicecandidate: participant.onIceCandidate.bind(participant)
      }
    
      participant.rtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(options, function(error) {
        if(error) return console.log(`ERROR! ${error}`);
        this.generateOffer (participant.offerToReceiveVideo.bind(participant));
      });
    }
    
    function onParticipantLeft(jsonMsg) {
      const participant = participants[jsonMsg.name];
      participant.dispose();
      delete participants[jsonMsg.name];
    }

    // 방 입장
    sendMessage({
      id : "joinRoom",
      name : myIdName,
      room : roomName,
    });
    return () => {
      // 방 퇴장
      sendMessage({
        id : 'leaveRoom'
      });
      for (let key in participants) {
        participants[key].dispose();
      }
      ws.close();
    }
  }, [])
  return <div>
    <div id="participants"></div>
  </div>
}