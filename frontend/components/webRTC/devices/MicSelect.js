import { useEffect, useRef } from "react"
import { connect } from "react-redux";

import { setMic } from "../../../store/actions/videoAction";
function mapDispatchToProps(dispatch) {
 return {
  setMic: (micId) => dispatch(setMic(micId)),
 }
}
export default connect(null, mapDispatchToProps)(MicSelect);

function MicSelect({setMic}) {
  const micSelectRef = useRef();
  useEffect(() => {
    const micSelect = micSelectRef.current
    async function getMic() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        let currentMic;
        devices.forEach(device => {
          if(device.kind === "audioinput") {
            const option = document.createElement("option");
            option.value = device.deviceId;
            option.innerText = device.label;
            if(!currentMic) {
              currentMic = device;
              option.selected = true;
              setMic(option.value)
            }
            micSelect.appendChild(option);
          }
        })
      }catch(err) {
        console.log(err);
      }
    }
    function inputEvent(e) {
      setMic(e.target.value);
    }
    micSelect.addEventListener("input", inputEvent);
    getMic();
    return () => micSelect.removeEventListener("input", inputEvent);
  }, [])

  return <select ref={micSelectRef} />
}