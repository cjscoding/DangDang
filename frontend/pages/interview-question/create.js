import styles from "../../scss/interview-question/form.module.scss";
import Link from "next/link";

import { addInterviewQuestion } from "../../api/interviewQuestion";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import { useEffect, useState } from "react";

export default connect()(addQuestion);

function addQuestion() {
  const router = useRouter();

  const [values, setValues] = useState({
    field: "",
    job: "IT",
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
    console.log(values);
    addInterviewQuestion(
      values,
      (res) => {
        console.log(res, "질문 등록 성공");
        alert("질문 등록 완료!");
        router.push("/interview-question/me");
      },
      (err) => console.log(err, "질문 등록 실패")
    );
  };

  useEffect(() => {
    const fieldSelectEl = document.getElementById("field")
    fieldSelectEl.firstChild.selected = true
    const nextValues = {
      ...values,
      field: fieldSelectEl.firstChild.value
    }
    setValues(nextValues);
  }, [])
  
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
          <textarea
            id="question"
            type="text"
            value={values.question}
            onChange={handleChange}
            placeholder="질문을 입력해주세요..."
            autoFocus
            required
          />
      </form>

      <button className={styles.submitBtn} onClick={handleSubmit}>
        등록
      </button>
    </div>
  );
}
