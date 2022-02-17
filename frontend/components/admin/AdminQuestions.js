import QuestionListRow from "./QuestionListRow";
import Pagination from "../../components/layout/Pagination";

import { setQuestionList } from "../../store/actions/adminAction";
import { getAllQuestionList } from "../../api/admin";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import styles from "../../scss/admin/container.module.scss";
import Selectbox from "../layout/Selectbox";
import Title from "../layout/Title";

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

  //   const fields = ["공통", "인성", "IT", "기타"];
  const [field, setField] = useState("공통");

  useEffect(() => {
    const param = {
      page: curPage,
      size: postsPerPage,
      field,
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
  }, [curPage, field]);

  useEffect(() => {
    setCurPage(0);
  }, [field]);

  useEffect(() => {
    console.log(questions);
  }, [questions]);

  const setFieldParam = (value) => setField(value);

  return (
    <div>
      <Title title="질문 관리"></Title>
      <div>
        <div className={styles.menu}>
          {/* <Selectbox values={fields}></Selectbox> */}
          <div className={styles.selectBox}>
            <select onChange={(event) => setFieldParam(event.target.value)}>
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
          <span>공개</span>
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
