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

  useEffect(() => {
    const params = {
      page: curPage,
      size: postsPerPage,
    };
    getInterviewQuestions(
      params,
      ({ data: { response } }) => {
        setQuestions(response.content);
        setTotalPosts(response.totalElements);
      },
      (error) => console.log(error)
    );
  }, [curPage]);

  return (
    <div className={styles.container}>
      <h1># 질문궁금하당</h1>

      <div className={styles.menuContainer}>
        <div>
          <input type="text" placeholder="검색" />
          <button>검색</button>
        </div>
        <div>
          {isLogin ? (
            <Link href="/interview-question/me">
              <button>내 질문 보기</button>
            </Link>
          ) : null}

          <Link href="/self-practice">
            <a>
              <button>연습 시작하기</button>
            </a>
          </Link>
        </div>
      </div>

      <div>
        <div>
          <select>
            <option value="분류">분류</option>
            <option value="공통">공통</option>
            <option value="인성">인성</option>
          </select>
          <span>질문</span>
        </div>

        {questions?.map((question) => (
          <QuestionListRow question={question} key={question.id} />
        ))}

        <Pagination
          curPage={curPage}
          paginate={paginate}
          totalCount={totalPosts}
          postsPerPage={postsPerPage}
        />
      </div>
    </div>
  );
}
