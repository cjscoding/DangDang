import AdminQuestions from "../../components/admin/AdminQuestions";
import AdminUsers from "../../components/admin/AdminUsers";

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
      <h1>관리자 페이지</h1>

      {user.role === "ADMIN" ? (
        <nav>
          <li onClick={() => setQuestionMode(true)}>질문</li>
          <li onClick={() => setQuestionMode(false)}>유저</li>
        </nav>
      ) : (
        <nav>
          <li onClick={() => setQuestionMode(true)}>질문</li>
        </nav>
      )}

      {questionMode ? <AdminQuestions /> : <AdminUsers />}
    </div>
  );
}
