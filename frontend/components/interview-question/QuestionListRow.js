import { deleteInterviewQuestion } from "../../api/interviewQuestion";
import { useRouter } from "next/router";
import { useState } from "react";

export default function QuestionListRow({ question, myQuestionMode, reload }) {
  const router = useRouter();
  const [showAnswer, setShowAnswer] = useState(false);

  //내 질문 삭제
  const deleteQuestion = (event) => {
    event.preventDefault();
    const params = {
      id: question.id,
    };

    deleteInterviewQuestion(
      params,
      (res) => {
        console.log(res, "질문 삭제가 완료되었습니다.");
        reload();
      },
      (error) => console.log(error)
    );
  };

  //내 질문 수정 페이지로 이동
  const onMoveUpdatePage = () => {
    const questionObj = {
      field: question.field,
      question: question.question,
      answer: question.answer,
    };
    router.push({
      pathname: "/interview-question/update",
      query: {
        id: question.id,
        question: JSON.stringify({ questionObj }),
      },
    });
  };

  return (
    <div>
      <div>
        <span>{question.field}</span>
        <div>
          <span>Q. {question.question}</span>
          <div className="btns">
            <button onClick={() => setShowAnswer(!showAnswer)}>
              <i className="fas fa-angle-down"></i>
            </button>
            {myQuestionMode ? (
              <div className="btns">
                <button onClick={onMoveUpdatePage}>
                  <i className="fas fa-pen"></i>
                </button>
                <button onClick={deleteQuestion}>
                  <i className="fas fa-trash"></i>
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
