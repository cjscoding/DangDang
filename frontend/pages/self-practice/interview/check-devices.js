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
        const cameras = devices.filter(device => device.kind === "videoinput");
        const currentCamera = stream.getVideoTracks()[0];
        cameras.forEach(camera => {
          const option = document.createElement("option");
          option.value = camera.deviceId;
          option.innerText = camera.label;
          if (currentCamera.label === camera.label) option.selected = true;
          cameraSelect.current.appendChild(option);
        });
        const mics = devices.filter(device => device.kind === "audioinput");
        const currentMic = stream.getAudioTracks()[0];
        mics.forEach(mic => {
          const option = document.createElement("option");
          option.value = mic.deviceId;
          option.innerText = mic.label;
          if (currentMic.label === mic.label) option.selected = true;
          micSelect.current.appendChild(option);
        });
        const speakers = devices.filter(device => device.kind === "audiooutput");
        const currentSpeaker = speakers[0];
        speakers.forEach(speaker => {
          const option = document.createElement("option");
          option.value = speaker.deviceId;
          option.innerText = speaker.label;
          if (currentSpeaker.label === speaker.label) option.selected = true;
          speakerSelect.current.appendChild(option);
        });
      }catch(err) {
        console.log(err);
      }
    }

    async function getMedia(cameraId, micId, speakerId) {
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
        if(speakerId) video.current.setSinkId(speakerId);
        if(!cameraId && !micId && !speakerId) await getDevices();
      }catch(err) {
        console.log(err);
      }
    }
    
    cameraSelect.current.addEventListener("input", () => getMedia(cameraSelect.current.value, null, null));
    micSelect.current.addEventListener("input", () => getMedia(null, micSelect.current.value, null));
    speakerSelect.current.addEventListener("input", () => getMedia(null, null, speakerSelect.current.value));
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