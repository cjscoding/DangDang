import styles from "../../scss/team/form.module.scss";

import { updateInterviewQuestion } from "../../api/interviewQuestion";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function ResumeUpdate() {
  const router = useRouter();

  const initData = {
    field: "",
    question: "",
    answer: "",
  };
  const [myQuestion, setMyQuestion] = useState(initData);

  useEffect(() => {
    if (!router.isReady) return;
    const question = JSON.parse(router.query.question);
    setMyQuestion(question.questionObj);
    console.log(question);
  }, [router.isReady]);

  //update question
  const onUpdateQuestion = (event) => {
    event.preventDefault();

    const data = {
      interviewQuestionId: router.query.id,
      req: {
        field: myQuestion.field,
        question: myQuestion.question,
        answer: myQuestion.answer,
      },
    };

    updateInterviewQuestion(
      data,
      (res) => {
        console.log(res, "글 수정 성공");
        onMoveViewPage();
      },
      (err) => {
        console.log(err, "글 수정 실패");
      }
    );
  };

  //input values
  const onChangeValue = (event) => {
    const { name, value } = event.target;

    const newQuestion = {
      ...myQuestion,
      [name]: value,
    };

    setMyQuestion(newQuestion);
  };

  //내 질문보기 페이지로 돌아가기
  const onMoveViewPage = () => {
    router.push({
      pathname: "/interview-question/me",
    });
  };

  return (
    <div className={styles.formContainer}>
      <button onClick={onMoveViewPage} className={styles.moveBackBtn}>
        <i className="fas fa-angle-double-left"></i> 돌아가기
      </button>

      <form>
        <h2>내 질문 수정</h2>

        <div className={styles.contents}>
          <label htmlFor="category">분류</label>
          <select
            name="field"
            onChange={onChangeValue}
            value={myQuestion.field}
          >
            <option value="공통">공통</option>
            <option value="인성">인성</option>
          </select>

          <label htmlFor="question">질문</label>
          <input
            type="text"
            name="question"
            value={myQuestion.question}
            onChange={onChangeValue}
            autoFocus
          />

          <label htmlFor="answer" className={styles.answerLabel}>
            답
          </label>
          <textarea
            type="text"
            name="answer"
            value={myQuestion.answer}
            onChange={onChangeValue}
          />
        </div>
      </form>

      <button className={styles.submitBtn} onClick={onUpdateQuestion}>
        수정
      </button>
    </div>
  );
}
