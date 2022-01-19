import { useEffect, useRef, useState } from "react"


export default function CheckDevices() {
  const [videoSize, setVideoSize] = useState(360) // 브라우저창 크기에 따라 크기 바꿀 예정
  const video = useRef(); // 화면 송출
  const cameraSelect = useRef();
  const micSelect = useRef();
  const speakerSelect = useRef();
  
  useEffect(() => {
    let stream;
    async function getDevices() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();        
        const currentCamera = stream.getVideoTracks()[0];
        const currentMic = stream.getAudioTracks()[0];
        let currentSpeaker;
        devices.forEach(device => {
          const option = document.createElement("option");
          option.value = device.deviceId;
          option.innerText = device.label;
          switch (device.kind) {
            case "videoinput":
              if (currentCamera.label === device.label) option.selected = true;
              cameraSelect.current.appendChild(option);
              return;
            case "audioinput":
              if (currentMic.label === device.label) option.selected = true;
              micSelect.current.appendChild(option);
              return;
            case "audiooutput":
              if(!currentSpeaker) {
                currentSpeaker = device;
                option.selected = true;
              }
              speakerSelect.current.appendChild(option);
              return;
            default:
              return;
          }
        });
      }catch(err) {
        console.log(err);
      }
    }

    async function getMedia(cameraId, micId) {
      const initialConstraints = { width: 1280, height: 720, facingMode: "user" };
      const cameraConstraints = {video: {deviceId: {exact: cameraId}}};
      const micConstraints = {audio: {deviceId: {exact: micId}}};
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          ...micId?micConstraints:{},
          video: {...initialConstraints},
          ...cameraId?cameraConstraints:{},
        });
        video.current.srcObject = stream;
        if(!cameraId && !micId) await getDevices();
      }catch(err) {
        console.log(err);
      }
    }
    
    cameraSelect.current.addEventListener("input", () => getMedia(cameraSelect.current.value, null));
    micSelect.current.addEventListener("input", () => getMedia(null, micSelect.current.value));
    speakerSelect.current.addEventListener("input", () => video.current.setSinkId(speakerSelect.current.value));
    getMedia();
  }, [])
  
  return <>
    <video ref={video} autoPlay playsInline width={videoSize * 16/9} height={videoSize} />
    <div>
      <select ref={cameraSelect} />
      <select ref={micSelect} />
      <select ref={speakerSelect} />
    </div>
  </>
}