import Table from "../../components/layout/table/table";
import TableRow from "../../components/layout/table/tableRow";
import TableColumn from "../../components/layout/table/tableColumn";
import styles from "../../scss/interview-question/main.module.scss";

export default function interviewQuestion() {
  const headers = ["카테고리", "질문"];
  return (
    <section className={styles.container}>
      <h1>인터뷰 질문</h1>
      <Table headers={headers}>
        <TableRow>
          <TableColumn>인성면접</TableColumn>
          <TableColumn>보리는 귀여운가요?</TableColumn>
        </TableRow>
        <TableRow>
          <TableColumn>기술면접</TableColumn>
          <TableColumn>
            당당이의 MBTI를 예측하고 그 이유를 말해주세요.
          </TableColumn>
        </TableRow>
      </Table>
    </section>
  );
}
