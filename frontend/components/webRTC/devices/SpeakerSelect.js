import { useEffect, useRef } from "react"
import { connect } from "react-redux";

import { setSpeaker } from "../../../store/actions/videoAction";
function mapStateToProps(state) {
  return {
    speakerId: state.videoReducer.speakerId, 
  };
}
function mapDispatchToProps(dispatch) {
 return {
   setSpeaker: (speakerId) => dispatch(setSpeaker(speakerId)),
 }
}
export default connect(mapStateToProps, mapDispatchToProps)(SpeakerSelect);

function SpeakerSelect({speakerId, setSpeaker}) {
  const speakerSelectRef = useRef();
  useEffect(() => {
    const speakerSelect = speakerSelectRef.current
    async function getSpeaker() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        let currentSpeakerId;
        if(speakerId) currentSpeakerId = speakerId
        devices.forEach(device => {
          if(device.kind === "audiooutput") {
            const option = document.createElement("option");
            option.value = device.deviceId;
            option.innerText = device.label;
            if(!currentSpeakerId) {
              currentSpeakerId = device.deviceId;
              option.selected = true;
              setSpeaker(option.value);
            }else if(currentSpeakerId === device.deviceId) {
              option.selected = true;
            }
            speakerSelect.appendChild(option);
          }
        })
      }catch(err) {
        console.log(err);
      }
    }
    function inputEvent(e) {
      setSpeaker(e.target.value);
    }
    speakerSelect.addEventListener("input", inputEvent);
    getSpeaker();
    return () => speakerSelect.removeEventListener("input", inputEvent);
  }, [])

  return <select ref={speakerSelectRef} />
}