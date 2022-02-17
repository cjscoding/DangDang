import styles from "../../scss/interview-question/questionListRow.module.scss";

import { deleteInterviewQuestion } from "../../api/interviewQuestion";
import { useRouter } from "next/router";

export default function QuestionListRow({ question, myQuestionMode, reload }) {
  const router = useRouter();

  //내 질문 삭제
  const deleteQuestion = (event) => {
    event.preventDefault();
    deleteInterviewQuestion(
      question.id,
      (res) => {
        alert("질문 삭제 완료!");
        console.log(res);
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
    <div className={styles.questionListRow}>
      <div className={styles.questionArea}>
        <span>{question.field === "기술" ? "IT" : question.field}</span>

        <div className={styles.contents}>
          <span>Q. {question.question}</span>

          <div className={styles.btns}>
            {myQuestionMode ? (
              <div>
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
    </div>
  );
}
