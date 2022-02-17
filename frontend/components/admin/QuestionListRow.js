import { useState } from "react";
import { setQuestionOpen, setQuestionPrivate } from "../../api/admin";
import styles from "../../scss/admin/questionRow.module.scss";

export default function QuestionListRow({ id, question }) {
  const [visible, setVisible] = useState(question.visable);

  // 질문 공개 설정
  const setOpen = () => {
    setVisible(true);
    setQuestionOpen(
      question.id,
      (res) => {
        console.log(res, "질문 공개 설정 완료");
      },
      (err) => console.log(err, "질문 공개 설정 실패")
    );
  };

  //질문 비공개 설정
  const setPrivate = () => {
    setVisible(false);
    setQuestionPrivate(
      question.id,
      (res) => {
        console.log(res, "질문 비공개 설정 완료");
      },
      (err) => console.log(err, "질문 비공개 설정 실패")
    );
  };

  return (
    <div className={styles.container}>
      <span>{question.field}</span>
      <p className={styles.question}>Q. {question.question}</p>
      {visible ? (
        <div>
          <input
            id={`toggle${id}`}
            type="checkbox"
            value={visible}
            className={styles.toggleContainer}
            onChange={setPrivate}
            checked
          />
          <label htmlFor={`toggle${id}`} className={styles.toggleBtn}></label>
        </div>
      ) : (
        <div>
          <input
            id={`toggle${id}`}
            type="checkbox"
            value={visible}
            className={styles.toggleContainer}
            onChange={setPrivate}
          />
          <label htmlFor={`toggle${id}`} className={styles.toggleBtn}></label>
        </div>
      )}
    </div>
  );
}
