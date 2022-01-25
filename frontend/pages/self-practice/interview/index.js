import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { connect } from "react-redux";
import styles from "../../../scss/self-practice/interview/mainComponent.module.scss";
import MyFace from "../../../components/webRTC/MyFace";

function mapStateToProps(state) {
  return {
    questions: state.questionReducer.questions,
  };
}
export default connect(mapStateToProps)(Interview);

function Interview({questions}) {
  const router = useRouter();
  const [screenNum, setScreenNum] = useState(3);
  const [questionNum, setQuestionNum] = useState(0);
  const [volume, setVolume] = useState(30);
  const [isVol, setIsVol] = useState(false);

  function restartQuestion() {

  }
  function saveAndNext() {
    if(questionNum === questions.length - 1) {
      router.push(`/self-practice/interview/end`);
    }
    setQuestionNum(questionNum + 1)
  }
  function skipQuestion() {
    if(questionNum === questions.length - 1) {
      router.push(`/self-practice/interview/end`);
    }
    setQuestionNum(questionNum + 1)
  }

  return <div>
  <div className={styles.closeBtnBox}>
    <Link href="/self-practice/interview/end">
      <a>
        <button className={styles.closeBtn}>종료</button>
      </a>
    </Link>
  </div>
  <div className={styles.container}>
    <div className={styles.videoContainer}>
      <div style={screenNum!==1?{display: "none"}:{}} className={styles.video1}>{questions[questionNum]}</div>
      <div style={screenNum!==2?{display: "none"}:{}} className={styles.video2}><MyFace /></div>
      <div style={screenNum!==3?{display: "none"}:{}} className={styles.video3}>면접관 얼굴 나올 예정(아래 버튼으로 화면 바꾸셈)</div>
      <div className={styles.changeBtn}>
        <span onClick={() => setScreenNum(1)}>●</span>
        <span onClick={() => setScreenNum(2)}>●</span>
        <span onClick={() => setScreenNum(3)}>●</span>
      </div>
      <div className={styles.btnContainer}>
        <span>
          <button onClick={() => setIsVol(true)}>음량조절</button><br/>
          <input style={isVol?{}:{display: "none"}} type="range" min="0" max="100" step="1" value={volume} onChange={(e) => setVolume(e.target.value)}/>
        </span>
        <button onClick={restartQuestion}>다시시작</button>
        <button onClick={saveAndNext}>저장&다음</button>
        <button onClick={skipQuestion}>질문스킵</button>
      </div>
    </div>
  </div>
</div>
}