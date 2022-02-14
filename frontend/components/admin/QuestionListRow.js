import { useState } from "react";
import { setQuestionOpen, setQuestionPrivate } from "../../api/admin";

export default function QuestionListRow({ question }) {
  const [visible, setVisible] = useState(question.visable);

  //질문 공개 설정
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
    <div>
      <span>{question.field}</span>
      <span>{question.question}</span>
      {visible ? (
        <button onClick={setPrivate}>비공개</button>
      ) : (
        <button onClick={setOpen}>공개</button>
      )}
    </div>
  );
}
