import Layout from "../../components/team-space/layout";
import styles from "../../scss/team-space/teamspace.module.scss";

export default function TeamSpace() {
  return (
    <div>
      <Layout />
      <div className={styles.container}>
        <div className={styles.info}>
          <h1>팀정보</h1>
          <span>팀명</span>
          <span>호롤롤로</span>
          <span>호스트</span>
          <span>보리</span>
          <span>팀원</span>
          <div>
              <span>보리</span>
              <span>지수</span>
              <span>혜인</span>
              <span>동유</span>
          </div>
        </div>
        <div className={styles.waiting}>
          <h1>대기명단</h1>
          <div>
              <span>윤준</span>
              <span>은지</span>
              <span>혁</span>
          </div>
        </div>
      </div>
    </div>
  );
}
