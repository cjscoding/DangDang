import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { getInterviewQuestions, getMyInterviewQuestions, getMyBookmarkQuestions } from "../../../api/interviewQuestion";
import Pagination from "../../../components/layout/Pagination";
import styles from "../../../scss/self-practice/interview/add-questions.module.scss";

function mapStateToProps(state) {
  return {
    wsSocket: state.wsReducer.ws,
    questions: state.questionReducer.questions,
    isLogin: state.userReducer.isLogin,
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

function AddQuestions({wsSocket, questions, isLogin, addQuestion, removeQuestion}) {
  const [questionInput, setQuestionInput] = useState("");
  const [allQuestions, setAllQuestions] = useState([]);
  const [myQuestions, setMyQuestions] = useState([]);
  const [bookmarkQuestions, setBookmartQuestions] = useState([]);
  const [qListNum, setQListNum] = useState(-1);
  const qKind = useRef();
  const [curPage, setCurPage] = useState(0);
  const [postsPerPage] = useState(10);
  const [totalPosts, setTotalPosts] = useState(100);
  const paginate = (pageNumber) => setCurPage(pageNumber);
  const router = useRouter();
  
  useEffect(() => {
    let ws = wsSocket
    if(!ws) {
      alert("잘못된 접근입니다.")
      ws = {}
      ws.send = function(){}
      ws.close = function(){}
      window.location.href = "/404"
      // router.push("/404")
    }

    const qKindEl = qKind.current
    const option0 = document.createElement("option");
    option0.value = 0
    option0.innerText = "전체 질문"
    option0.selected = true
    qKindEl.appendChild(option0);
    if(isLogin) {
      const option1 = document.createElement("option");
      option1.value = 1
      option1.innerText = "등록한 질문"
      qKindEl.appendChild(option1);
      const option2 = document.createElement("option");
      option2.value = 2
      option2.innerText = "즐겨찾기 질문"
      qKindEl.appendChild(option2);
    }
    setQListNum(0)
    function changeQListNum(event) {
      setQListNum(parseInt(event.target.value))
    }
    qKindEl.addEventListener("change", changeQListNum)

    window.addEventListener("beforeunload", ()=>{
      const delMsg = JSON.stringify({id:"del"});
      ws.send(delMsg);
      ws.close();
    });
    return () => {
      qKindEl.removeEventListener("change", changeQListNum)
    }
  }, [])

  useEffect(() => {
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
      case 2:
        if(!isLogin) break;
        getMyBookmarkQuestions({
          page: curPage,
          size: postsPerPage
        }, ({data: {response}}) => {
          setBookmartQuestions(response.content)
          setTotalPosts(response.totalElements)
        }, (error) => {
          console.log(error)
        })
        break
      default:
        break
    }
  }, [curPage])
  useEffect(() => {
    setCurPage(0)
    switch(qListNum) {
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
      case 2:
        if(!isLogin) break;
        getMyBookmarkQuestions({
          page: 0,
          size: postsPerPage
        }, ({data: {response}}) => {
          setBookmartQuestions(response.content)
          setTotalPosts(response.totalElements)
        }, (error) => {
          console.log(error)
        })
        break
      default:
        break
    }
  }, [qListNum])

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
            <span>면접 질문 리스트</span>
            <select ref={qKind} />
          </div>
          <div className={styles.QuestionList}>
            <div style={qListNum!==0?{display: "none"}:{}}>
              {allQuestions?.map(question => (
                <div key={question.id} className={styles.question}>
                  <span>{question.field} | {question.question} <button onClick={()=>addQuestion(question.field, question.question)}><i className="fas fa-plus"></i></button></span>
                </div>
              ))}
            </div>
            <div style={qListNum!==1?{display: "none"}:{}}>
              {myQuestions?.map(question => (
                <div key={question.id} className={styles.question}>
                  <span>{question.field} | {question.question} <button onClick={()=>addQuestion(question.field, question.question)}><i className="fas fa-plus"></i></button></span>
                </div>
              ))}
            </div>
            <div style={qListNum!==2?{display: "none"}:{}}>
              {bookmarkQuestions?.map(question => (
                <div key={question.id} className={styles.question}>
                  <span>{question.field} | {question.question} <button onClick={()=>addQuestion(question.field, question.question)}><i className="fas fa-plus"></i></button></span>
                </div>
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