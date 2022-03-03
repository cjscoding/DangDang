import Link from "next/link";
import { connect } from "react-redux";
import styles from "../../../scss/self-practice/interview/select-questionlist.module.scss";
import menuStyles from "../../../scss/self-practice/interview/menu.module.scss";
import SockJS from "sockjs-client";
import { WEBRTC_URL } from "../../../config";
import { useEffect } from "react";
import Title from "../../../components/layout/Title";

function mapStateToProps(state) {
  return {
    ws: state.wsReducer.ws,
  };
}
import { setQuestions } from "../../../store/actions/questionAction";
import { connectSocket } from "../../../store/actions/wsAction";
function mapDispatchToProps(dispatch) {
  const ws = new SockJS(`${WEBRTC_URL}/recording`);
  dispatch(connectSocket(ws));
  dispatch(setQuestions([]));
  return {};
}
export default connect(mapStateToProps, mapDispatchToProps)(SelectQuestions);

function SelectQuestions({ ws }) {
  useEffect(() => {
    window.addEventListener("beforeunload", () => {
      const delMsg = JSON.stringify({ id: "del" });
      ws.send(delMsg);
      ws.close();
    });
  }, []);
  return (
    <div className={styles.body}>
      <Title title="혼자연습한당"></Title>
      <div className={menuStyles.pindicator}>
        <div className={menuStyles.bullet}>
          <span className={`${menuStyles.iconcur} ${menuStyles.first}`}>
            <span>1</span>
          </span>
          <div className={menuStyles.text}>질문 유형 선택</div>
        </div>
        <div className={menuStyles.bullet}>
          <span className={menuStyles.icon}>2</span>
          <div className={menuStyles.text}>질문 선택</div>
        </div>
        <div className={menuStyles.bullet}>
          <span className={menuStyles.icon}>3</span>
          <div className={menuStyles.text}>카메라 설정</div>
        </div>
      </div>
      <span className={menuStyles.title}>질문 유형을 선택해주세요.</span>
      <div className={styles.selectBox}>
        <Link href="/self-practice/interview/check-devices">
          <a>
            <div className={styles.borderBox}>
              <i className="fas fa-question fa-2x"></i>
              <br></br>
              <h2>기본 질문</h2>
              <p>
                <span id={styles.dangdang}>당당!</span>이 엄선한<br></br>
                면접 필수 질문 세트
              </p>
            </div>
          </a>
        </Link>
        <Link href="/self-practice/interview/add-questions">
          <a>
            <div className={styles.borderBox}>
              <i className="fas fa-file fa-2x"></i>
              <br></br>
              <h2>질문 선택</h2>
              <p>
                원하는 질문을 선택해서<br></br>
                면접을 연습해 보세요
              </p>
            </div>
          </a>
        </Link>
      </div>
    </div>
  );
}
