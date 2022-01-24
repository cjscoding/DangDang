import Layout from "../../components/team-space/layout";
import styles from "../../scss/team-space/teamspace.module.scss";
export default function CoverLetter() {
  return (
    <div>
      <Layout />
      <h1>자기소개서</h1>
      <div className={styles.coverletter}>
        <div className={styles.member}>
          <ul>
            <li>보리</li>
            <li>지수</li>
            <li>혜인</li>
            <li>윤준</li>
            <li>동유</li>
            <li>은지</li>
            <li>혁</li>
          </ul>
        </div>
        <div className="articles">
          <div className="list">
            <div className="question">질문1</div>
            <div className="answer">답</div>
          </div>
        </div>
      </div>
    </div>
  );
}
