import Link from "next/link";
import { useEffect } from "react";
import { connect } from "react-redux";
import Table from "../../../components/layout/table/table";
import TableColumn from "../../../components/layout/table/tableColumn";
import TableRow from "../../../components/layout/table/tableRow";
import {
  getMyInterviewQuestions,
  deleteInterviewQuestion,
} from "../../../api/interviewQuestion";
import { setMyQuestions } from "../../../store/actions/questionAction";

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
  const headers = ["카테고리", "질문"];
  console.log(myQuestions);
  useEffect(() => {
    getQuestion();
  }, []);

  const getQuestion = () => {
    const params = {
      page: 0,
      size: 10,
    };
    getMyInterviewQuestions(
      params,
      ({ data: { response } }) => {
        setMyQuestions(response.content);
      },
      (error) => console.log(error)
    );
  };

  const deleteQuestion = (id) => {
    if (confirm("정말 삭제하시겠습니까?") === true) {
      const params = {
        id,
      };
      deleteInterviewQuestion(
        params,
        (response) => {
          getQuestion();
        },
        (error) => console.log(error)
      );
    } else return;
  };

  return (
    <section>
      <Link href="/interview-question">모든 질문 보기</Link>
      <Link href="/interview-question/add">내 질문 등록하기</Link>
      {Array.isArray(myQuestions) && myQuestions.length === 0 ? (
        <div>
          아직 등록한 나만의 질문이 없어요. "내 질문 등록하기"를 눌러 나만의
          질문을 등록해보세요!
        </div>
      ) : (
        <Table headers={headers}>
          {myQuestions.map((myQuestion, index) => (
            <TableRow key={index}>
              <TableColumn>{myQuestion.field}</TableColumn>
              <TableColumn>
                {myQuestion.question}
                <div>
                  <Link href={`/interview-question/edit/${myQuestion.id}`}>
                    <a>수정</a>
                  </Link>
                  <a onClick={() => deleteQuestion(myQuestion.id)}>삭제</a>
                </div>
              </TableColumn>
            </TableRow>
          ))}
        </Table>
      )}
    </section>
  );
}
