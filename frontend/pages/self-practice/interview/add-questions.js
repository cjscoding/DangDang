import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { getInterviewQuestions, getMyInterviewQuestions } from "../../../api/interviewQuestion";
import Pagination from "../../../components/layout/Pagination";
import styles from "../../../scss/self-practice/interview/add-questions.module.scss";

function mapStateToProps(state) {
  return {
    ws: state.wsReducer.ws,
    questions: state.questionReducer.questions,
    isLogin: state.userReducer.isLogin,
    user: state.userReducer.user,
  };
}
  
import { addQuestion, removeQuestion } from "../../../store/actions/questionAction";
function mapDispatchToProps(dispatch) {
  return {
    addQuestion: (field, question) => dispatch(addQuestion(field, question)),
    removeQuestion: (idx) => dispatch(removeQuestion(idx))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddQuestions); 

function AddQuestions({ws, questions, isLogin, user, addQuestion, removeQuestion}) {
  const [questionInput, setQuestionInput] = useState("");
  const [allQuestions, setAllQuestions] = useState([]);
  const [myQuestions, setMyQuestions] = useState([]);
  const [qListNum, setQListNum] = useState(0);
  const [curPage, setCurPage] = useState(0);
  const [postsPerPage] = useState(10);
  const [totalPosts, setTotalPosts] = useState(100);
  const paginate = (pageNumber) => setCurPage(pageNumber);
  //async 임시용임, 수정할 것임
  useEffect(() => {
    if(!ws) window.location.href = "/self-practice/interview/select-questionlist";
    switch(qListNum) {
      case 0:
        getInterviewQuestions({
          page: curPage,
          size: postsPerPage
        }, ({data: {response}}) => {
          setAllQuestions(response.content)
          setTotalPosts(response.totalElements)
        }, (error) => {
          console.log(error)
        })
        break
      case 1:
        if(!isLogin) break;
        getMyInterviewQuestions({
          page: curPage,
          size: postsPerPage
        }, ({data: {response}}) => {
          setMyQuestions(response.content)
          setTotalPosts(response.totalElements)
        }, (error) => {
          console.log(error)
        })
        break
      default:
        break
    }
  }, [curPage])

  function addQuestionInput(field, question) {
    const trimedQuestion = question.trim()
    if(trimedQuestion) {
      addQuestion(field, trimedQuestion);
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
  function changeQuetionList(num) {
    setCurPage(0)
    setQListNum(num)
    switch(num) {
      case 0:
        getInterviewQuestions({
          page: 0,
          size: postsPerPage
        }, ({data: {response}}) => {
          setAllQuestions(response.content)
          setTotalPosts(response.totalElements)
        }, (error) => {
          console.log(error)
        })
        break
      case 1:
        if(!isLogin) break;
        getMyInterviewQuestions({
          page: 0,
          size: postsPerPage
        }, ({data: {response}}) => {
          setMyQuestions(response.content)
          setTotalPosts(response.totalElements)
        }, (error) => {
          console.log(error)
        })
        break
      default:
        break
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
    <span className={styles.title}>연습에 사용할 질문을 골라주세요.</span>
    <div className={styles.mainContainer}>
      <div className={styles.rowContainer}>
        {/* <div className={styles.changeBtn}>
          <button onClick={() => changeQuetionList(0)}>●</button>
          {isLogin?<button onClick={() => changeQuetionList(1)}>●</button>:null}
        </div> */}
        <div className={styles.ContainerL}>
          <div className={styles.QuestionContainer}>
          <div className={styles.QuestionTitle}> 
            <span>면접 질문 리스트 <span className={styles.changeBtn}>
            <button onClick={() => changeQuetionList(0)}>●</button>
            {isLogin?<button onClick={() => changeQuetionList(1)}>●</button>:null}
            </span></span>
          </div>
          <div className={styles.QuestionList}>
            <div style={qListNum!==0?{display: "none"}:{}}>
              {allQuestions?.map(question => (
                <div className={styles.question}>
                  <span key={question.id}>{question.field} | {question.question} <button onClick={()=>addQuestion(question.field, question.question)}><i className="fas fa-plus"></i></button></span>
                </div>
              ))}
            </div>
            <div style={qListNum!==1?{display: "none"}:{}} className={styles.question}>
              {myQuestions?.map(question => (
                <span key={question.id}>{question.field} | {question.question} <button onClick={()=>addQuestion(question.field, question.question)}><i className="fas fa-plus"></i></button></span>
              ))}
            </div>
          </div>
          </div>
          <div className={styles.addContainer}>
            <input value={questionInput} onChange={(event) => {setQuestionInput(event.target.value)}} placeholder="나만의 질문을 입력해주세요!"></input>
            <button onClick={()=>addQuestionInput("미확인", questionInput)}><i className="fas fa-paper-plane"></i></button>
          </div>
          <div className={styles.pagination}>
            <Pagination
            curPage={curPage}
            paginate={paginate}
            totalCount={totalPosts}
            postsPerPage={postsPerPage}
            />
          </div>
        </div>
        <div className={styles.ContainerR}>
          <div className={styles.selectedContainer}>
            <div className={styles.selectedTitle}><span>내가 선택한 질문</span><div id={styles.total}>총 {questions.length}개</div> </div>
            <div className={styles.selectedList}>
              {questions?.map((question, idx) => (
                <div className={styles.question}>
                  <span key={idx}>{question.field} | {question.question} <button onClick={()=>removeQuestion(idx)}><i className="fas fa-times"></i></button></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>  
    <Link href="/self-practice/interview/check-devices">
      <button onClick={alertBlank} id={styles.submitBtn}>다음 단계로</button>
    </Link>
  </div>
}