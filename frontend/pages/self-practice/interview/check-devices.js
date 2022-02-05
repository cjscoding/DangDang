import Link from "next/link";
import { useEffect } from "react"
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
    isQs: state.questionReducer.questions.length !== 0,
    ws: state.wsReducer.ws,
  };
}
import { setQuestions } from "../../../store/actions/questionAction";
function mapDispatchToProps(dispatch) {
  return {
    setQuestions: (questions) => dispatch(setQuestions(questions))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(CheckDevices);

function CheckDevices({preparedQuestions, isQs, setQuestions}) {
  useEffect(() => {
    if(!isQs) {
      setQuestions(preparedQuestions);
    }

    window.onbeforeunload = function() {
      sendMessage({
        id : 'del',
      });
      ws.close();
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
      <Link href="/self-practice/interview">
        <a className={styles.nextBtn}
        >
          <button><h1>NEXT</h1></button>
        </a>
      </Link>
    </div>
  </div>
}