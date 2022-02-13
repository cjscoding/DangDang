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
      {field: "미확인", question: "안녕하세요"},
      {field: "미확인", question: "점심 맛있게 드셨어요?"},
      {field: "미확인", question: "하나의 쓰기 스레드와 여러 읽기 스레드가 존재할 때 사용되어야 하는 Java의 동기화 기능은 무엇이고 어떻게 동작하게 되는지 설명해주세요."},
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

  return <div className={styles.body}>
    <div className={styles.pindicator}>
      <div className={styles.bullet}>
        <span className={styles.icon}>1</span>
        <div className={styles.text}>Step 1</div>
      </div>
      <div className={styles.bullet}>
        <span className={styles.icon}>2</span>
        <div className={styles.text}>Step 2</div>
      </div>
      <div className={styles.bullet}>
        <span className={styles.iconcur}><span>3</span></span>
        <div className={styles.text}>Step 3</div>
      </div>
    </div>
    <span className={styles.title}>카메라와 마이크 설정을 확인해주세요.</span>
    <div className={styles.videoContainer}>
      <div><MyFace /></div>
      <div className={styles.selectContainer}>
        <div>
          <label htmlFor="camera-select"></label><br/>
          <span className={styles.span}><i className="fas fa-camera"></i></span>
          <CameraSelect id="camera-select"/><br/>
        </div>
        <div>
          <label htmlFor="mic-select"></label><br/>
          <span className={styles.span}><i className="fas fa-microphone"></i></span>
          <MicSelect id="mic-select" /><br/>
        </div>
        <div>
          <label htmlFor="speaker-select"></label><br/>
          <span className={styles.span}><i className="fas fa-headphones"></i></span>
          <SpeakerSelect id="speaker-select" /><br/>
        </div>
      </div>
      <button ref={nextBtn} className={styles.nextBtn}>연습 시작하기!</button>
    </div>
  </div>
}