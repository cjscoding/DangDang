import { useEffect, useRef } from "react"
import { connect } from "react-redux";

import { setMic } from "../../../store/actions/videoAction";
function mapStateToProps(state) {
  return {
    micId: state.videoReducer.micId, 
  };
}
function mapDispatchToProps(dispatch) {
 return {
  setMic: (micId) => dispatch(setMic(micId)),
 }
}
export default connect(mapStateToProps, mapDispatchToProps)(MicSelect);

function MicSelect({micId, setMic}) {
  const micSelectRef = useRef();
  useEffect(() => {
    const micSelect = micSelectRef.current
    async function getMic() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        let currentMicId;
        if(micId) currentMicId = micId
        devices.forEach(device => {
          if(device.kind === "audioinput") {
            const option = document.createElement("option");
            option.value = device.deviceId;
            option.innerText = device.label;
            if(!currentMicId) {
              currentMicId = device.deviceId;
              option.selected = true;
              setMic(currentMicId)
            }else if(currentMicId === device.deviceId){
              option.selected = true;
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