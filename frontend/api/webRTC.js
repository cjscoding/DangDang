import axios from "axios";
import { BACKEND_URL } from "../config";
import { store } from "../store";

export async function ttsService(txt, volume) {
  let source;
  await axios({
    method:"post",
    url: `${BACKEND_URL}/api/tts`,
    data: {text:txt},
  }).then(async (res)=>{
    // string을 arraybuffer로 바꾸는 과정
    function str2ab(str) {
      var buf = new ArrayBuffer(str.length);
      var bufView = new Uint8Array(buf);
      for (var i=0, strLen=str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
      }
      return buf;
    }
    const arraybuffer = str2ab(res.data)

    const context=new AudioContext();
    // 사운드 조절을 위해 gainNode를 추가
    // console.log(store.getState().videoReducer.speakerId)
    const gainNode = context.createGain()
    gainNode.connect(context.destination)
    // arraybuffer 재생
    await context.decodeAudioData(arraybuffer, async buffer=>{
      source = context.createBufferSource();
      source.buffer = buffer;
      source.connect(gainNode);
      gainNode.gain.value = volume / 100
      // source.start(0);
    });
  }).catch((error)=>{
    console.log(error);
  })
  return source
}