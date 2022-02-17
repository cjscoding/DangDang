import QuestionListRow from "../../components/interview-question/QuestionListRow";
import styles from "../../scss/interview-question/main.module.scss";
import Pagination from "../../components/layout/Pagination";
import Link from "next/link";

import { getMyInterviewQuestions } from "../../api/interviewQuestion";
import { setMyQuestions } from "../../store/actions/questionAction";
import { useEffect, useState } from "react";
import { connect } from "react-redux";

function mapStateToProps({ questionReducer }) {
  return {
    myQuestions: questionReducer.myQuestions,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setMyQuestions: (myQuestions) => dispatch(setMyQuestions(myQuestions)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(myQuestion);

function myQuestion({ myQuestions, setMyQuestions }) {
  //pagination
  const [curPage, setCurPage] = useState(0);
  const [postsPerPage] = useState(10);
  const [totalPosts, setTotalPosts] = useState(0);
  const paginate = (pageNumber) => setCurPage(pageNumber);

  const [field, setField] = useState("공통");
  const [question, setQuestion] = useState("");

  useEffect(() => {
    getQuestions();
  }, [curPage, , field, question]);

  const reload = () => {
    setCurPage(0);
    getQuestions();
  };

  const getQuestions = () => {
    const params = {
      field,
      question,
      page: curPage,
      size: postsPerPage,
    };

    getMyInterviewQuestions(
      params,
      ({ data: { response } }) => {
        setMyQuestions(response.content);
        setTotalPosts(response.totalElements);
      },
      (error) => console.log(error)
    );
  };

  const setKeyword = (event) => {
    event.preventDefault();
    if (event.target.value === "" || event.key === "Enter") {
      setQuestion(event.target.value);
    }
  };

  return (
    <div className={styles.mainContainer}>
      <h1># 내 질문이당</h1>

      <div className={styles.topBar}>
        <input
          type="text"
          placeholder="검색어를 입력하고 엔터키를 눌러주세요..."
          onKeyUp={setKeyword}
        />

        <div className={styles.btns}>
          <Link href="/interview-question">
            <a className={styles.isNotButton}>모든 질문 보기</a>
          </Link>

          <Link href="/interview-question/create">
            <button className={styles.isButton}>내 질문 등록하기</button>
          </Link>
        </div>
      </div>

      {Array.isArray(myQuestions) && myQuestions.length === 0 ? (
        <div className={styles.noQuestions}>
          <span>아직 등록한 질문이 없어요 ㅜ.ㅜ</span>
          <p>
            <strong>
              <Link href="/interview-question/create">
                <a>내 질문 등록하기</a>
              </Link>
            </strong>
            에서 나만의 질문을 등록해보세요!
          </p>
        </div>
      ) : (
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
            {myQuestions?.map((question) => (
              <QuestionListRow
                question={question}
                myQuestionMode={true}
                reload={reload}
                key={question.id}
              />
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
      )}
    </div>
  );
}
