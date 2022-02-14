import styles from "../../scss/interview-question/form.module.scss";
import Link from "next/link";

import { addInterviewQuestion } from "../../api/interviewQuestion";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import { useState } from "react";

export default connect()(addQuestion);

function addQuestion() {
  const router = useRouter();

  const [values, setValues] = useState({
    field: options[0],
    question: "",
    answer: "",
  });

  const handleChange = ({ target: { id, value } }) => {
    const nextValues = {
      ...values,
      [id]: value,
    };
    setValues(nextValues);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    addInterviewQuestion(
      values,
      (res) => {
        console.log(res, "질문 등록 성공");
        router.push("/interview-question/me");
      },
      (err) => console.log(err, "질문 등록 실패")
    );
  };

  return (
    <div className={styles.formContainer}>
      <Link href="/interview-question/me">
        <a className={styles.moveBackBtn}>
          <i className="fas fa-angle-double-left"></i> 목록으로
        </a>
      </Link>

      <form>
        <h2>내 질문 등록</h2>

        <div className={styles.contents}>
          <label htmlFor="field">분류</label>
          <select id="field" onChange={handleChange}>
            <option value="공통">공통</option>
            <option value="인성">인성</option>
            <option value="기술">IT</option>
            <option value="기타">기타</option>
          </select>

          <label htmlFor="question">질문</label>
          <input
            id="question"
            type="text"
            value={values.question}
            onChange={handleChange}
            placeholder="질문을 입력해주세요..."
            autoFocus
            required
          />

          <label htmlFor="answer">답변</label>
          <textarea
            id="answer"
            value={values.answer}
            placeholder="답변을 입력해주세요..."
            onChange={handleChange}
          />
        </div>
      </form>

      <button className={styles.submitBtn} onClick={handleSubmit}>
        등록
      </button>
    </div>
  );
}
