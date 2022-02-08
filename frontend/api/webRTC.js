import axios from "axios";
import { BACKEND_URL } from "../config";

export function ttsService(txt) {
  axios({
    // method:"post",
    // url:"https://kakaoi-newtone-openapi.kakao.com/v1/synthesize",
    // headers:{
    //     "Content-Type":"application/xml",
    //     "Authorization": "KakaoAK c420902bf013e6a215efef159a46af41",
    // },
    // data:`<speak><voice name='MAN_READ_CALM'>${txt}</voice></speak>`,
    // responseType: 'arraybuffer',
    // url: `${BACKEND_URL}/api/tts?text=${txt}`
    method:"post",
    url: `${BACKEND_URL}/api/tts`,
    data: txt,
  }).then((res)=>{
    // string을 arraybuffer로 바꾸는 과정
    function encode_utf8(s) {
      return unescape(encodeURIComponent(s));
    }
    function decode_utf8(s) {
      return decodeURIComponent(escape(s));
    }
    // var uint8array = new TextEncoder("utf-8").encode(res.data)
    function str2ab(str) {
      var buf = new ArrayBuffer(str.length);
      var bufView = new Uint8Array(buf);
      for (var i=0, strLen=str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
      }
      return buf;
    }
    const arraybuffer = str2ab(res.data)
    console.log(arraybuffer)

    const context=new AudioContext();
    context.decodeAudioData(arraybuffer,buffer=>{
      const source = context.createBufferSource();
      source.buffer = buffer;
      source.connect(context.destination);
      source.start(0);
    });
  }).catch((error)=>{
      console.log(error);
  })
}