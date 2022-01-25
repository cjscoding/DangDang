import { useEffect, useRef } from "react"
import { connect } from "react-redux";

import { setCamera } from "../../../store/actions/videoAction";
function mapDispatchToProps(dispatch) {
 return {
  setCamera: (cameraId) => dispatch(setCamera(cameraId)),
 }
}
export default connect(null, mapDispatchToProps)(CameraSelect);

function CameraSelect({setCamera}) {
  const cameraSelectRef = useRef();
  useEffect(() => {
    const cameraSelect = cameraSelectRef.current
    async function getCamera() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        let currentCamera;
        devices.forEach(device => {
          if(device.kind === "videoinput") {
            const option = document.createElement("option");
            option.value = device.deviceId;
            option.innerText = device.label;
            if(!currentCamera) {
              currentCamera = device;
              option.selected = true;
              setCamera(option.value)
            }
            cameraSelect.appendChild(option);
          }
        })
      }catch(err) {
        console.log(err);
      }
    }
    function inputEvent(e) {
      setCamera(e.target.value);
    }
    cameraSelect.addEventListener("input", inputEvent);
    getCamera();
    return () => cameraSelect.removeEventListener("input", inputEvent);
  }, [])

  return <select ref={cameraSelectRef} />
}