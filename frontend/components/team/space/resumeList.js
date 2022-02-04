import styles from "../../../scss/team/space/resume.module.scss";

import { updateResume, deleteResume } from "../../../api/resume";
import { useState } from "react";

export default function ResumeList({ resume, index }) {
  const [questionId] = useState(resume.resumeQuestionList[0].id);
  const [resumeId] = useState(resume.id);
  const [question, setQuestion] = useState(
    resume.resumeQuestionList[0].question
  );
  const [answer, setAnswer] = useState(resume.resumeQuestionList[0].answer);
  const [isUpdate, setIsUpdate] = useState(false);

  //자소서 수정
  const onSubmitUpdated = (event) => {
    event.preventDefault();
    const data = {
      resumeId,
      req: {
        resumeQuestionList: [
          {
            id: questionId,
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
        setIsUpdate(false);
      },
      (err) => {
        console.log(err, "자소서 갱신 실패");
      }
    );
  };

  //자소서 삭제
  const onDeleteResume = () => {
    deleteResume(
      resumeId,
      (res) => {
        console.log(res, "자소서 삭제 성공");
      },
      (err) => {
        console.log(err, "자소서 삭제 실패");
      }
    );
  };

  return (
    <div className={styles.resumeOneItem}>
      {isUpdate ? (
        <form onSubmit={onSubmitUpdated}>
          <label htmlFor="question">질문</label>
          <input
            name="question"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
          />
          <label htmlFor="answer">답</label>
          <input
            name="answer"
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
          />
          <div className="btns">
            <button>수정완료</button>
            <button onClick={() => setIsUpdate(!isUpdate)}>취소</button>
          </div>
        </form>
      ) : (
        <div>
          <div>
            <h4>
              Q{index + 1} : {question}
            </h4>
            <p>
              A{index + 1} : {answer}
            </p>
          </div>

          <div className="btns">
            <button onClick={() => setIsUpdate(!isUpdate)}>수정</button>
            <button onClick={onDeleteResume}>삭제</button>
          </div>
        </div>
      )}
    </div>
  );
}
