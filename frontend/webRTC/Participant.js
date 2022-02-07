export default function Participant(name) {
  this.name = name;
  let video = document.createElement("video");
  let rtcPeer;

  this.getVideo = () => video;
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