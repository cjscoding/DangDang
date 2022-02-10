import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import styles from "../../../scss/self-practice/interview/add-questions.module.scss";

function mapStateToProps(state) {
  return {
    ws: state.wsReducer.ws,
    questions: state.questionReducer.questions,
    isLogin: state.userReducer.isLogin,
    user: state.userReducer.user,
  };
}
  
import { addQuestion } from "../../../store/actions/questionAction";
function mapDispatchToProps(dispatch) {
  return {
    addQuestion: (question) => dispatch(addQuestion(question))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddQuestions); 

function AddQuestions({ws, questions, isLogin, user, addQuestion}) {
  const [questionInput, setQuestionInput] = useState("");
  const [allQuestions, setAllQuestions] = useState([]);
  const [myQuestions, setMyQuestions] = useState([]);
  const [qListNum, setQListNum] = useState(0);
  //async 임시용임, 수정할 것임
  useEffect(async() => {
    if(!ws) window.location.href = "/self-practice/interview/select-questionlist";
    const allQs = (await(await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/interview`,{
      method: 'GET'
    })).json()).response.content
    setAllQuestions(allQs);
    if(isLogin){
      const myQs = (await(await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/interview`,{
        method: 'GET'
      })).json()).response.content
      setMyQuestions(myQs)
    }

  }, [])
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
      alert("질문을 추가해주세요!");
    }
  }

  return <div className={styles.body}>
    <div className={styles.pindicator}>
      <div className={styles.bullet}>
        <span className={styles.icon}>1</span>
        <div className={styles.text}>Step 1</div>
      </div>
      <div className={styles.bullet}>
        <span className={styles.iconcur}><span>2</span></span>
        <div className={styles.text}>Step 2</div>
      </div>
      <div className={styles.bullet}>
        <span className={styles.icon}>3</span>
        <div className={styles.text}>Step 3</div>
      </div>
    </div>
    <h1>연습에 사용할 질문을 골라주세요.</h1>
    <div className={styles.mainContainer}>
      <div className={styles.columnContainer}>
        <div className={styles.changeBtn}>
          <span onClick={() => setQListNum(0)}>●</span>
          {isLogin?<span onClick={() => setQListNum(1)}>●</span>:null}
        </div>
        <div className={styles.baseContainer}>
          <div style={qListNum!==0?{display: "none"}:{}}>
            {allQuestions?.map(question => (
              <h2 key={question.id}>{question.question}</h2>
            ))}
          </div>
          <div style={qListNum!==1?{display: "none"}:{}}>
            {myQuestions?.map(question => (
              <h2 key={question.id}>{question.question}</h2>
            ))}
          </div>
        </div>
        <div className={styles.addContainer}>
          <input value={questionInput} onChange={(event) => {setQuestionInput(event.target.value)}} placeholder="나만의 질문을 입력해주세요!"></input>
          <button onClick={addQuestionInput}>면접질문추가</button>
        </div>
      </div>
      <div className={styles.selectedContainer}>
        {questions?.map((question, idx) => (
          <h1 key={idx}>{question}</h1>
        ))}
      </div>
    </div>
    <Link href="/self-practice/interview/check-devices">
      <button onClick={alertBlank} id={styles.submitBtn}>다음 단계로</button>
    </Link>
  </div>
}