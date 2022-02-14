import QuestionListRow from "./QuestionListRow";
import Pagination from "../../components/layout/Pagination";

import { setQuestionList } from "../../store/actions/adminAction";
import { getAllQuestionList } from "../../api/admin";
import { useEffect, useState } from "react";
import { connect } from "react-redux";

const mapStateToProps = (state) => {
  return {
    questions: state.adminReducer.questions,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setQuestions: (questions) => dispatch(setQuestionList(questions)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminQuestion);

function AdminQuestion({ questions, setQuestions }) {
  //pagination
  const [curPage, setCurPage] = useState(0);
  const [postsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(questions.totalElements);
  const paginate = (pageNumber) => setCurPage(pageNumber);

  useEffect(() => {
    const param = {
      page: curPage,
      size: postsPerPage,
    };
    getAllQuestionList(
      param,
      (res) => {
        console.log(res, "질문 리스트 조회 성공");
        setQuestions(res.data.response.content);
        setTotalElements(res.data.response.totalElements);
      },
      (err) => console.log(err, "질문 리스트 조회 실패")
    );
  }, [curPage]);

  return (
    <div>
      <div>
        <div>
          <span>분류</span>
          <span>질문</span>
          <span>설정</span>
        </div>

        {questions &&
          questions.map((question) => (
            <QuestionListRow key={question.id} question={question} />
          ))}
      </div>

      <div className="pagination">
        <Pagination
          curPage={curPage}
          paginate={paginate}
          totalCount={totalElements}
          postsPerPage={postsPerPage}
        />
      </div>
    </div>
  );
}
