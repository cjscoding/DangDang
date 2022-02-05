import Link from "next/link";
import { connect } from "react-redux";
import Table from "../../components/layout/table/table";
import TableRow from "../../components/layout/table/tableRow";
import TableColumn from "../../components/layout/table/tableColumn";
import styles from "../../scss/interview-question/main.module.scss";
import { getInterviewQuestions } from "../../api/interviewQuestion";
import { setQuestions } from "../../store/actions/questionAction";
import { useEffect } from "react";

function mapStateToProps({ questionReducer }) {
  return {
    questions: questionReducer.questions,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setQuestions: (questions) => dispatch(setQuestions(questions)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(interviewQuestion);

function interviewQuestion({ questions, setQuestions }) {
  const headers = ["카테고리", "질문"];
  useEffect(() => {
    // if (Array.isArray(questions) && questions.length === 0) {
    getInterviewQuestions(
      ({ data: { response } }) => {
        setQuestions(response);
      },
      (error) => console.log(error)
    );
    // }
  }, []);

  return (
    <section className={styles.container}>
      <h1>인터뷰 질문</h1>
      <div className={styles.menuContainer}>
        <div>
          <input type="text" placeholder="검색" />
          <button>검색</button>
        </div>
        <div>
          <Link href="/interview-question/me">
            <button>내 질문 보기</button>
          </Link>
          <Link href="/self-practice">
            <a>
              <button>연습 시작하기</button>
            </a>
          </Link>
        </div>
      </div>
      <Table headers={headers}>
        {questions.map((question, index) => (
          <TableRow key={index}>
            <TableColumn>{question.field}</TableColumn>
            <TableColumn>{question.question}</TableColumn>
          </TableRow>
        ))}
      </Table>
    </section>
  );
}
