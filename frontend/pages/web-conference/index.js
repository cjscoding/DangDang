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
    roomName: 1,
    myName: dateStr,
  };
}
export default connect(mapStateToProps)(Conference);

function Conference({roomName, myName}) {
  let participants = {};
  const [videos, setVideos] = useState([]);
  useEffect(() => {
    function Participant(name) {
      this.name = name;
      // let video = document.createElement("video");
      // video.autoplay = true;
      // video.controls = false;
      let rtcPeer;
    
      this.getVideo = function() {
        return <MyFace />;
      }
      this.offerToReceiveVideo = (error, offerSdp, wp) => {
        sendmessage({
          id: "receiveVideoFrom",
          sender: this.name,
          sdpOffer: offerSdp,
        });
      };
      this.onIceCandidate = (candidate, wp) => {
        sendmessage({
          id: "onIceCandidate",
          candidate,
          name: this.name,
        });
      };
      this.dispose = () => {
        this.rtcPeer.dispose();
        // 요소에서도 삭제해야함.
      }
    }
    const ws = new SockJS(`${WEBRTC_URL}/groupcall`);
    function sendmessage(json) {
      const stringMsg = JSON.stringify(json);
      ws.send(stringMsg);
    }

    setTimeout(()=>{
      sendmessage({
        id: 'joinRoom',
        name: myName,
        room: roomName,
      })
    },3000)
    // sendmessage({
    //   id: 'joinRoom',
    //   name: myName,
    //   room: roomName,
    // })
    ws.onmessage = function(msg) {
      console.log(msg)
      const json = JSON.parse(msg.data)
      switch(json.id) {
        case 'existingParticipants':
          onExistingParticipants(json);
          break;
        case "newParticipantArrived":
          onNewParticipant(json);
          break;
        case "participantLeft":
          onParticipantLeft(json);
          break;
        case "receiveVideoAnswer":
          onReceiveVideoAnswer(json);
          break;
        case 'iceCandidate':
          participants[json.name].rtcPeer.addIceCandidate(json.candidate, function (error) {
            if (error) {
            console.log(`ERROR! ${error}`);
            return;
            }
          });
          break;
        default:
          console.log(`ERROR! ${msg.data}`)
      }
    };
    function onExistingParticipants(json) {
      const constraints = {
        audio: true,
        video: {
          mandatory : {
            maxWidth : 320,
            maxFrameRate : 15,
            minFrameRate : 15,
          },
        },
      };
      const participant = new Participant(myName);
      participants[myName] = participant
      const options = {
        localVideo: participant.getVideo(),
        mediaConstraints: constraints,
        onicecandidate: participant.onIceCandidate,
      };
      participant.rtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(options, function(error) {
        if(error) return console.log(`ERROR! ${error}`)
        this.generateOffer(participant.offerToReceiveVideo);
      });
      json.data.forEach(name => receiveVideo(name))
    }
    function onNewParticipant(json) {
      receiveVideo(json.name)
    }
    function receiveVideo(other) {
      const participant = new Participant(other);
      participants[other] = participant
      const options = {
        remoteVideo: participant.getVideo(),
        onicecandidate: participant.onIceCandidate,
      };
      participant.rtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(options, function(error) {
        if(error) return console.log(`ERROR! ${error}`);
        this.generateOffer(participant.offerToReceiveVideo);
      });
    }
    function onParticipantLeft(json){
      participants[json.name].dispose();
    }
    function onReceiveVideoAnswer(json){
      participants[json.name].rtcPeer.processAnswer(json.sdpAnswer, function(error) {
        if(error) return console.log(`ERROR! ${error}`);
      })
    }

    // 메시지 보내기

    // 방나갈때
    return () => {
      console.log(participants)
      sendmessage({
        id: "leaveRoom",
      })
      for(const name in participants) {
        participants[name].dispose();
      }
      ws.close();
    }
  }, [])

  // useEffect(() => {
    // const list = Object.keys(participants).map(name => {
    //   console.log(participants[name].rtcPeer)
    //   return participants[name].getVideo()
    // })
  //   setVideos(list)
  // }, [participants])
  return <div>
    {/* <div><MyFace id="my-video" /></div> */}
    <div>{Object.keys(participants).map(name => (
      <h2>{JSON.stringify(participants[name].rtcPeer)}</h2>
    ))}</div>
  </div>
}
// participants[name].getVideo())