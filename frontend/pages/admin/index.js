import { useState } from "react";
import AdminQuestions from "../../components/admin/AdminQuestions";
import AdminUsers from "../../components/admin/AdminUsers";
import styles from "../../scss/admin/main.module.scss";

export default function Admin() {
  const [questionMode, setQuestionMode] = useState(true);

  return (
    <div className={styles.mainContainer}>
      <nav className={styles.menu}>
        <li
          onClick={() => setQuestionMode(true)}
          className={questionMode ? styles.questionMode : null}
        >
          질문 관리
        </li>
        <li
          onClick={() => setQuestionMode(false)}
          className={questionMode ? null : styles.userMode}
        >
          회원 관리
        </li>
      </nav>

      <div className={styles.container}>
        {questionMode ? <AdminQuestions /> : <AdminUsers />}
      </div>
    </div>
  );
}
