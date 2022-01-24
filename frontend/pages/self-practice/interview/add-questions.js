import Link from "next/link";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import styles from "../../../scss/self-practice/interview/add-questions.module.scss";

function mapStateToProps(state) {
    return {questions: state.questionReducer.questions};
  }
  
import { addQuestion } from "../../../store/actions/questionAction";
function mapDispatchToProps(dispatch) {
  return {
    addQuestion: (question) => dispatch(addQuestion(question))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddQuestions); 

function AddQuestions({questions, addQuestion}) {
  const [questionInput, setQuestionInput] = useState("");
  function addQuestionInput() {
    const Qinput = questionInput.trim()
    if(Qinput) {
      addQuestion(Qinput);
    }else {
      alert("값을 입력해주세요");
    }
    setQuestionInput("");
  }
  function alertBlank(event) {
    if(questions.length === 0) {
      event.preventDefault();
      alert("질문을 추가해주세요!")
    }
  }
  return <div>
    <div className={styles.mainContainer}>
      <div className={styles.columnContainer}>
        <div className={styles.baseContainer}>
          <h1></h1>
        </div>
        <div className={styles.addContainer}>
          <textarea value={questionInput} onChange={(event) => {setQuestionInput(event.target.value)}}></textarea>
          <button onClick={addQuestionInput}>면접질문추가</button>
        </div>
      </div>
      <div className={styles.selectedContainer}>
      {questions.map((question, idx) => <h1 key={idx}>{question}</h1>
      )}
      </div>
    </div>
    <Link href="/self-practice/interview/check-devices">
      <a><button onClick={alertBlank}><h1>선택 완료</h1></button></a>
    </Link>
  </div>
}