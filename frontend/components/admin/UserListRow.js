import { useState } from "react";
import { setUserAsManager } from "../../api/admin";

export default function UserListRow({ user }) {
  const [role, setRole] = useState(user.role);

  //매니저로 등업
  const setRoleAsManager = () => {
    setRole("MANAGER");
    setUserAsManager(
      user.id,
      (res) => {
        console.log(res, "매니저 등업 완료");
      },
      (err) => console.log(err, "매니저 등업 실패")
    );
  };
  return (
    <div>
      <span>{user.id}</span>
      <span>{user.nickName}</span>
      {role === "USER" ? (
        <button onClick={setRoleAsManager}>등업</button>
      ) : (
        <span>매니저</span>
      )}
    </div>
  );
}
