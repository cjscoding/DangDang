import styles from "../../scss/interview-question/form.module.scss";
import Link from "next/link";

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
        job: "IT", //임시
        question: myQuestion.question,
        answer: myQuestion.answer,
      },
    };

    updateInterviewQuestion(
      data,
      (res) => {
        console.log(res, "질문 수정 성공");
        router.push("/interview-question/me");
      },
      (err) => {
        console.log(err, "질문 수정 실패");
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

  return (
    <div className={styles.formContainer}>
      <Link href="/interview-question/me">
        <a className={styles.moveBackBtn}>
          <i className="fas fa-angle-double-left"></i> 목록으로
        </a>
      </Link>

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
            <option value="기술">IT</option>
            <option value="기타">기타</option>
          </select>

          <label htmlFor="question">질문</label>
          <input
            type="text"
            name="question"
            value={myQuestion.question}
            onChange={onChangeValue}
            placeholder="질문을 입력해주세요..."
            autoFocus
            required
          />

          <label htmlFor="answer">답변</label>
          <textarea
            type="text"
            name="answer"
            value={myQuestion.answer}
            onChange={onChangeValue}
            placeholder="답변을 입력해주세요..."
          />
        </div>
      </form>

      <button className={styles.submitBtn} onClick={onUpdateQuestion}>
        수정
      </button>
    </div>
  );
}
