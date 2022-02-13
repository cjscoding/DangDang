import styles from "../../scss/team/form.module.scss";
import Link from "next/link";

import { addInterviewQuestion } from "../../api/interviewQuestion";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import { useState } from "react";

export default connect()(addQuestion);

function addQuestion() {
  const router = useRouter();
  const options = ["공통", "기술", "인성", "기타"];
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
    <div>
      <h2>내 질문 등록하기</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="field">
            분류
            <select id="field" onChange={handleChange}>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label htmlFor="question">
            질문
            <input
              id="question"
              type="text"
              value={values.question}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label htmlFor="answer">
            답
            <textarea
              id="answer"
              value={values.answer}
              onChange={handleChange}
            />
          </label>
        </div>
        <button type="submit">등록하기</button>
      </form>
      <Link href="/interview-question/me">
        <a>목록으로</a>
      </Link>
    </div>
  );
}
