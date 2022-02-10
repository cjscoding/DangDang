import styles from "../../../../scss/team/form.module.scss";

import { updateResume } from "../../../../api/resume";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function ResumeUpdate() {
  const router = useRouter();
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState("");

  useEffect(() => {
    if (!router.isReady) return;
    setQuestion(router.query.question);
    setAnswer(router.query.answer);
  }, [router.isReady]);

  //자소서 수정
  const onSubmitUpdated = (event) => {
    event.preventDefault();
    const data = {
      resumeId: router.query.resumeId,
      req: {
        resumeQuestionList: [
          {
            id: router.query.questionId,
            question,
            answer,
          },
        ],
      },
    };
    updateResume(
      data,
      (res) => {
        console.log(res, "자소서 갱신 성공");
        onMoveResumePage();
      },
      (err) => {
        console.log(err, "자소서 갱신 실패");
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
        <h2>자기소개서 수정</h2>

        <div className={styles.contents}>
          <label htmlFor="question">제목</label>
          <input
            name="question"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            autoFocus
          />

          <label htmlFor="answer" className={styles.answerLabel}>
            내용
          </label>
          <textarea
            name="answer"
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
          ></textarea>
        </div>
      </form>

      <button className={styles.submitBtn} onClick={onSubmitUpdated}>
        수정
      </button>
    </div>
  );
}
