import axios from "axios";
import { BACKEND_URL } from "../config";

export function ttsService(txt) {
  axios({
    method:"post",
    url:"https://kakaoi-newtone-openapi.kakao.com/v1/synthesize",
    headers:{
        "Content-Type":"application/xml",
        "Authorization": "KakaoAK c420902bf013e6a215efef159a46af41",
    },
    data:`<speak><voice name='MAN_READ_CALM'>${txt}</voice></speak>`,
    responseType: 'arraybuffer',
    // url: `${BACKEND_URL}/api/tts?text=${txt}`
  }).then((res)=>{
    // arraybuffer를 재생하는 코드 
    console.log(res.data)
    console.log(typeof res.data)
    const context=new AudioContext();
    context.decodeAudioData(res.data,buffer=>{
      const source = context.createBufferSource();
      source.buffer = buffer;
      source.connect(context.destination);
      source.start(0);
    });
  }).catch((error)=>{
      console.log(error);
  })
}