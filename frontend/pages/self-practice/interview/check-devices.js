import { useRouter } from "next/router";
import { useEffect, useRef } from "react"
import { connect } from "react-redux";
import CameraSelect from "../../../components/webRTC/devices/CameraSelect";
import MicSelect from "../../../components/webRTC/devices/MicSelect";
import SpeakerSelect from "../../../components/webRTC/devices/SpeakerSelect";
import MyFace from "../../../components/webRTC/MyFace";
import styles from "../../../scss/self-practice/interview/check-devices.module.scss";
import { BACKEND_URL } from "../../../config";

export async function getServerSideProps() {
  const params = {
    page: 0,
    size: 5
  }
  let preparedQuestions;
  // SSR은 localStorage가 없음
  await fetch(`${BACKEND_URL}/interview/recommend`, {
    method: "get",
    params
  })
    .then((res) => {
      preparedQuestions = res.data.response.content.map(question => {
        return {
          field: question.field,
          question: question.question
        }
      })
    })
    .catch((err) => {
      preparedQuestions = [
        {field: "미확인", question: "자기소개를 해주세요."},
        {field: "미확인", question: "지원자가 기업을 선택하는 기준이 무엇인가요?"},
        {field: "미확인", question: "동료와 갈등이 있다면 어떻게 풀어나가겠습니까?"},
        {field: "미확인", question: "인생관이나 좌우명을 말해주세요."},
        {field: "미확인", question: "스스로 부족한 점에 대해 이야기해 보세요."},
      ]
    })
  return {props: {preparedQuestions}};
};
function mapStateToProps(state) {
  return {
    wsSocket: state.wsReducer.ws,
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
function CheckDevices({preparedQuestions, wsSocket, isQs, setQuestions}) {
  const nextBtn = useRef();
  const router = useRouter();

  useEffect(() => {
    let ws = wsSocket
    if(!ws) {
      alert("잘못된 접근입니다.")
      ws = {}
      ws.send = function(){}
      ws.close = function(){}
      window.location.href = "/404"
      // router.push("/404")
    }

    if(!isQs) {
      setQuestions(preparedQuestions);
    }

    function goTointerview() {
      router.push("/self-practice/interview");
    }
    const nextBtnEl = nextBtn.current
    nextBtnEl.addEventListener("click", goTointerview)

    window.addEventListener("beforeunload", ()=>{
      const delMsg = JSON.stringify({id:"del"});
      ws.send(delMsg);
      ws.close();
    });
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