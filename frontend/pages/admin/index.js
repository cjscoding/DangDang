import AdminQuestions from "../../components/admin/AdminQuestions";
import AdminUsers from "../../components/admin/AdminUsers";
import styles from "../../scss/admin/main.module.scss";

import { useState } from "react";
import { connect } from "react-redux";

const mapStateToProps = (state) => {
  return {
    user: state.userReducer.user,
  };
};

export default connect(mapStateToProps, null)(Admin);

function Admin({ user }) {
  const [questionMode, setQuestionMode] = useState(true);

  return (
    <div>
      <div className={styles.mainContainer}>
        <nav className={styles.menu}>
          <li
            onClick={() => setQuestionMode(true)}
            className={questionMode ? styles.questionMode : null}
          >
            질문 관리
          </li>
          {user.role === "ADMIN" ? (
            <li
              onClick={() => setQuestionMode(false)}
              className={questionMode ? null : styles.userMode}
            >
              회원 관리
            </li>
          ) : null}
        </nav>

        <div className={styles.container}>
          {questionMode ? <AdminQuestions /> : <AdminUsers />}
        </div>
      </div>
    </div>
  );
}
