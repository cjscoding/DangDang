import { deleteInterviewQuestion } from "../../api/interviewQuestion";
import { useState } from "react";

export default function QuestionListRow({ question, myQuestionMode }) {
  const [showAnswer, setShowAnswer] = useState(false);

  //내 질문 삭제
  const deleteQuestion = (id) => {
    const params = {
      id,
    };
    deleteInterviewQuestion(
      params,
      (response) => {
        getQuestion();
      },
      (error) => console.log(error)
    );
  };

  //내 질문 수정 페이지로 이동
  const onMoveUpdatePage = () => {};

  return (
    <div>
      <div>
        <span>{question.field}</span>
        <div>
          <span>Q. {question.question}</span>
          <div className="btns">
            <button onClick={() => setShowAnswer(!showAnswer)}>
              <i class="fas fa-angle-down"></i>
            </button>
            {myQuestionMode ? (
              <div className="btns">
                <button onClick={onMoveUpdatePage}>
                  <i class="fas fa-pen"></i>
                </button>
                <button onClick={deleteQuestion(question.id)}>
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {showAnswer ? (
        <div>
          <div></div>
          <span>A. {question.answer}</span>
        </div>
      ) : null}
    </div>
  );
}
