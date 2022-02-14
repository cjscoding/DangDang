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
  const options = [
    "공통",
    "기술",
    "인성",
    "기타",
    "IT",
    "금융",
    "회계",
    "디자인",
  ];

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
    if (event.key === "Enter") {
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
              <button className={styles.isNotButton}>내 질문 보기</button>
            </Link>
          ) : null}

          <Link href="/self-practice">
            <button className={styles.isButton}>연습 시작하기</button>
          </Link>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.header}>
          <select onChange={(event) => setField(event.target.value)}>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span>질문</span>
        </div>

        <div className={styles.table}>
          {questions?.map((question) => (
            <QuestionListRow question={question} key={question.id} />
          ))}
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
