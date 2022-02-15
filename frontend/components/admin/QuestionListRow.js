import { useState } from "react";
import { setQuestionOpen, setQuestionPrivate } from "../../api/admin";
import styles from "../../scss/admin/questionRow.module.scss";

export default function QuestionListRow({ id, question }) {
  const [visible, setVisible] = useState(question.visable);

  const handleChange = () => {
    setVisible((curr) => !curr);
    if (visible) {
      setQuestionOpen(
        question.id,
        (res) => {
          console.log(res, "질문 공개 설정 완료");
        },
        (err) => console.log(err, "질문 공개 설정 실패")
      );
    } else {
      setQuestionPrivate(
        question.id,
        (res) => {
          console.log(res, "질문 비공개 설정 완료");
        },
        (err) => console.log(err, "질문 비공개 설정 실패")
      );
    }
  };
  //질문 공개 설정
  // const setOpen = () => {
  //   setVisible(true);
  //   setQuestionOpen(
  //     question.id,
  //     (res) => {
  //       console.log(res, "질문 공개 설정 완료");
  //     },
  //     (err) => console.log(err, "질문 공개 설정 실패")
  //   );
  // };

  // //질문 비공개 설정
  // const setPrivate = () => {
  //   setVisible(false);
  //   setQuestionPrivate(
  //     question.id,
  //     (res) => {
  //       console.log(res, "질문 비공개 설정 완료");
  //     },
  //     (err) => console.log(err, "질문 비공개 설정 실패")
  //   );
  // };

  return (
    <div className={styles.container}>
      <span>{question.field}</span>
      <span className={styles.question}>{question.question}</span>
      <div>
        <input
          id={`toggle${id}`}
          type="checkbox"
          value={visible}
          onChange={handleChange}
          className={styles.toggleContainer}
        />
        <label htmlFor={`toggle${id}`} className={styles.toggleBtn}></label>
      </div>
    </div>
  );
}
