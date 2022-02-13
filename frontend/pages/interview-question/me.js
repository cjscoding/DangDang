import QuestionListRow from "../../components/interview-question/QuestionListRow";
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

  useEffect(() => {
    const params = {
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
  }, [curPage]);

  return (
    <section>
      <Link href="/interview-question">
        <a>모든 질문 보기</a>
      </Link>
      <Link href="/interview-question/add">
        <a>내 질문 등록하기</a>
      </Link>
      {Array.isArray(myQuestions) && myQuestions.length === 0 ? (
        <div>
          아직 등록한 나만의 질문이 없어요. "내 질문 등록하기"를 눌러 나만의
          질문을 등록해보세요!
        </div>
      ) : (
        <div>
          <div>
            <select>
              <option value="분류">분류</option>
              <option value="공통">공통</option>
              <option value="인성">인성</option>
            </select>
            <span>질문</span>
          </div>

          {myQuestions?.map((question) => (
            <QuestionListRow
              question={question}
              myQuestionMode={true}
              key={question.id}
            />
          ))}

          <Pagination
            curPage={curPage}
            paginate={paginate}
            totalCount={totalPosts}
            postsPerPage={postsPerPage}
          />
        </div>
      )}
    </section>
  );
}
