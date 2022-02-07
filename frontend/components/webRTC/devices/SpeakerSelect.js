import { useEffect, useRef } from "react"
import { connect } from "react-redux";

import { setSpeaker } from "../../../store/actions/videoAction";
function mapDispatchToProps(dispatch) {
 return {
   setSpeaker: (speakerId) => dispatch(setSpeaker(speakerId)),
 }
}
export default connect(null, mapDispatchToProps)(SpeakerSelect);

function SpeakerSelect({setSpeaker}) {
  const speakerSelectRef = useRef();
  useEffect(() => {
    const speakerSelect = speakerSelectRef.current
    async function getSpeaker() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        let currentSpeaker;
        devices.forEach(device => {
          if(device.kind === "audiooutput") {
            const option = document.createElement("option");
            option.value = device.deviceId;
            option.innerText = device.label;
            if(!currentSpeaker) {
              currentSpeaker = device;
              option.selected = true;
              setSpeaker(option.value);
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