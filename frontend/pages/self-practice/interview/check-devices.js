import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react"
import { connect } from "react-redux";
import CameraSelect from "../../../components/webRTC/devices/CameraSelect";
import MicSelect from "../../../components/webRTC/devices/MicSelect";
import SpeakerSelect from "../../../components/webRTC/devices/SpeakerSelect";
import MyFace from "../../../components/webRTC/MyFace";
import styles from "../../../scss/self-practice/interview/check-devices.module.scss";

export async function getServerSideProps() {
  const preparedQuestions = [
      "안녕하세요",
      "점심 맛있게 드셨어요?",
      "다음에 봬요!"
  ] // api요청으로 교체될 파트
  return {props: {preparedQuestions}};
};
function mapStateToProps(state) {
  return {
    ws: state.wsReducer.ws,
    isQs: state.questionReducer.questions.length !== 0,
  };
}
import { setQuestions } from "../../../store/actions/questionAction";
function mapDispatchToProps(dispatch) {
  return {
    setQuestions: (questions) => dispatch(setQuestions(questions))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(CheckDevices);

function CheckDevices({preparedQuestions, ws, isQs, setQuestions}) {
  const nextBtn = useRef();
  const router = useRouter();
  useEffect(() => {
    if(!ws) window.location.href = "/self-practice/interview/select-questionlist";
    if(!isQs) {
      setQuestions(preparedQuestions);
    }

    function goTointerview() {
      router.push("/self-practice/interview");
    }
    const nextBtnEl = nextBtn.current
    nextBtnEl.addEventListener("click", goTointerview)
    return () => {
      nextBtnEl.removeEventListener("click", goTointerview)
    }
  }, [])

  return <div className={styles.container}>
    <div className={styles.videoContainer}>
      <div><MyFace /></div>
      <div className={styles.selectContainer}>
        <label htmlFor="camera-select">카메라</label><br/>
        <CameraSelect id="camera-select" /><br/>
        <label htmlFor="mic-select">마이크</label><br/>
        <MicSelect id="mic-select" /><br/>
        <label htmlFor="speaker-select">스피커</label><br/>
        <SpeakerSelect id="speaker-select" /><br/>
      </div>
      <button ref={nextBtn} className={styles.nextBtn}><h1>NEXT</h1></button>
    </div>
  </div>
}