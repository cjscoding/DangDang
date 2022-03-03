import { useEffect, useRef } from "react"
import { connect } from "react-redux";

import { setCamera } from "../../../store/actions/videoAction";
function mapStateToProps(state) {
  return {
    cameraId: state.videoReducer.cameraId, 
  };
}
function mapDispatchToProps(dispatch) {
 return {
  setCamera: (cameraId) => dispatch(setCamera(cameraId)),
 }
}
export default connect(mapStateToProps, mapDispatchToProps)(CameraSelect);

function CameraSelect({cameraId, setCamera}) {
  const cameraSelectRef = useRef();
  useEffect(() => {
    const cameraSelect = cameraSelectRef.current
    async function getCamera() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        let currentCameraId;
        if(cameraId) currentCameraId = cameraId
        devices.forEach(device => {
          if(device.kind === "videoinput") {
            const option = document.createElement("option");
            option.value = device.deviceId;
            option.innerText = device.label;
            if(!currentCameraId) {
              currentCameraId = device.deviceId;
              option.selected = true;
              setCamera(currentCameraId)
            }else if(currentCameraId === device.deviceId) {
              option.selected = true;
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