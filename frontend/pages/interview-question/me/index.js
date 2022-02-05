import Link from "next/link";
import { connect } from "react-redux";
import Table from "../../../components/layout/table/table";
import TableColumn from "../../../components/layout/table/tableColumn";
import TableRow from "../../../components/layout/table/tableRow";

function mapStateToProps({ userReducer, questionReducer }) {
  return {
    questions: questionReducer.questions.filter(
      (question) => userReducer.user.id === question.writer.id
    ),
  };
}

export default connect(mapStateToProps)(myQuestion);

function myQuestion({ questions }) {
  const headers = ["카테고리", "질문"];
  console.log(questions);
  return (
    <section>
      <Link href="/interview-question">모든 질문 보기</Link>
      <Link href="/interview-question/add">내 질문 등록하기</Link>
      {Array.isArray(questions) && questions.length === 0 ? (
        <div>
          아직 등록한 나만의 질문이 없어요. "내 질문 등록하기"를 눌러 나만의
          질문을 등록해보세요!
        </div>
      ) : (
        <Table headers={headers}>
          {questions.map((question, index) => (
            <TableRow key={index}>
              <TableColumn>{question.field}</TableColumn>
              <TableColumn>{question.question}</TableColumn>
            </TableRow>
          ))}
        </Table>
      )}
    </section>
  );
}
