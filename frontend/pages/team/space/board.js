import Layout from "../../../components/team/space/layout";
import styles from "../../../scss/team/space/teamspace.module.scss";
export default function Board() {
  return (
    <div>
      <Layout />
      <div className={styles.container}>
        <h1>꿀팁s</h1>
        <button className={styles.createBtn}>글 작성</button>
        <div className={styles.table}>
          <table>
            <thead>
              <tr className="">
                <th>분류</th>
                <th className="">제목</th>
                <th>작성자</th>
                <th>작성일</th>
                <th>조회수</th>
              </tr>
            </thead>
            <tbody>
                <td>공고</td>
                <td>하반기 공채 일정</td>
                <td>지수</td>
                <td>2022.01.24</td>
                <td>10</td>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
