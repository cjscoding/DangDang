import QuestionListRow from "./QuestionListRow";
import Pagination from "../../components/layout/Pagination";

import { setQuestionList } from "../../store/actions/adminAction";
import { getAllQuestionList } from "../../api/admin";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import styles from "../../scss/admin/container.module.scss";
import Selectbox from "../layout/Selectbox";

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

  const fields = ["공통", "인성", "IT", "기타"];

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

  useEffect(() => {
    console.log(questions);
  }, [questions]);
  // console.log(questions);
  return (
    <div>
      <div>
        <div className={styles.menu}>
          <Selectbox values={fields}></Selectbox>
          <span>질문</span>
          <span>설정</span>
        </div>

        {questions &&
          questions.map((question) => (
            <QuestionListRow
              key={question.id}
              question={question}
              id={question.id}
            />
          ))}
      </div>

      <div className={styles.pagination}>
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
