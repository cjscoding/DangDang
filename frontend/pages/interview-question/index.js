import QuestionListRow from "../../components/interview-question/QuestionListRow";
import styles from "../../scss/interview-question/main.module.scss";
import Pagination from "../../components/layout/Pagination";
import Link from "next/link";

import { getInterviewQuestions } from "../../api/interviewQuestion";
import { setQuestions } from "../../store/actions/questionAction";
import { useEffect, useState } from "react";
import { connect } from "react-redux";

function mapStateToProps({ userReducer, questionReducer }) {
  return {
    isLogin: userReducer.isLogin,
    questions: questionReducer.questions,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setQuestions: (questions) => dispatch(setQuestions(questions)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(interviewQuestion);

function interviewQuestion({ isLogin, questions, setQuestions }) {
  //pagination
  const [curPage, setCurPage] = useState(0);
  const [postsPerPage] = useState(10);
  const [totalPosts, setTotalPosts] = useState(0);
  const paginate = (pageNumber) => setCurPage(pageNumber);

  const [field, setField] = useState("공통");
  const [question, setQuestion] = useState("");

  useEffect(() => {
    console.log(field);
    console.log(question);
    const params = {
      field,
      question,
      page: curPage,
      size: postsPerPage,
    };
    getInterviewQuestions(
      params,
      ({ data: { response } }) => {
        console.log(response);
        setQuestions(response.content);
        setTotalPosts(response.totalElements);
      },
      (error) => console.log(error)
    );
  }, [curPage, field, question]);

  const setKeyword = (event) => {
    event.preventDefault();
    if (event.target.value === "" || event.key === "Enter") {
      setQuestion(event.target.value);
    }
  };

  return (
    <div className={styles.mainContainer}>
      <h1># 질문궁금하당</h1>

      <div className={styles.topBar}>
        <input
          type="text"
          placeholder="검색어를 입력하고 엔터키를 눌러주세요..."
          onKeyUp={setKeyword}
        />

        <div className={styles.btns}>
          {isLogin ? (
            <Link href="/interview-question/me">
              <a className={styles.isNotButton}>내 질문 보기</a>
            </Link>
          ) : null}

          <Link href="/self-practice">
            <button className={styles.isButton}>연습 시작하기</button>
          </Link>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.selectBox}>
            <select onChange={(event) => setField(event.target.value)}>
              <option value="공통">공통</option>
              <option value="인성">인성</option>
              <option value="기술">IT</option>
              <option value="기타">기타</option>
            </select>
            <span className={styles.selectArrowIcon}>
              <i className="fas fa-angle-down"></i>
            </span>
          </div>

          <span>질문</span>
        </div>

        <div className={styles.table}>
          {questions && questions.length === 0 ? (
            <span className={styles.noQuestion}>
              아직 등록된 질문이 없어요 ㅜ.ㅜ
            </span>
          ) : (
            questions.map((question) => (
              <QuestionListRow question={question} key={question.id} />
            ))
          )}
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
    </div>
  );
}
