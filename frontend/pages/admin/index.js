import { useState } from "react";
import AdminQuestions from "../../components/admin/AdminQuestions";
import AdminUsers from "../../components/admin/AdminUsers";

export default function Admin() {
  const [questionMode, setQuestionMode] = useState(true);

  return (
    <div>
      <h1>관리자 페이지</h1>

      <nav>
        <li onClick={() => setQuestionMode(true)}>질문</li>
        <li onClick={() => setQuestionMode(false)}>유저</li>
      </nav>

      {questionMode ? <AdminQuestions /> : <AdminUsers />}
    </div>
  );
}
