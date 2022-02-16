import styles from "../../../../scss/team/form.module.scss";

import { createResume } from "../../../../api/resume";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import { useState } from "react";

const mapStateToProps = (state) => {
  return {
    userInfo: state.userReducer.user,
  };
};

export default connect(mapStateToProps, null)(CreateResume);

function CreateResume() {
  const router = useRouter();
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState("");

  const onSubmitResume = (event) => {
    event.preventDefault();
    const data = {
      studyId: router.query.id,
      req: {
        resumeQuestionList: [
          {
            question,
            answer,
          },
        ],
      },
    };

    createResume(
      data,
      (res) => {
        console.log(res, "자소서 등록 성공");
        onMoveResumePage();
      },
      (err) => {
        console.log(err, "자소서 등록 실패");
      }
    );
  };

  //자소서 페이지로 돌아가기
  const onMoveResumePage = () => {
    router.push({
      pathname: "/team/space/resume",
      query: {
        id: router.query.id,
        page: "resume",
      },
    });
  };

  return (
    <div className={styles.formContainer}>
      <button onClick={onMoveResumePage} className={styles.moveBackBtn}>
        <i className="fas fa-angle-double-left"></i> 돌아가기
      </button>

      <form>
        <h2>자기소개서 등록</h2>

        <div className={styles.contents}>
          <label htmlFor="question">제목</label>
          <input
            name="question"
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="제목을 입력해주세요..."
            autoFocus
          />

          <label htmlFor="answer" className={styles.answerLabel}>
            내용
          </label>
          <textarea
            name="answer"
            onChange={(event) => setAnswer(event.target.value)}
            placeholder="내용을 입력해주세요..."
          ></textarea>
        </div>
      </form>
      <button className={styles.submitBtn} onClick={onSubmitResume}>
        등록
      </button>
    </div>
  );
}
