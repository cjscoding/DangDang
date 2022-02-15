import { useState } from "react";
import { setUserAsManager } from "../../api/admin";
import styles from "../../scss/admin/userRow.module.scss";

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
    <div className={styles.container}>
      <span>{user.id}</span>
      <span className={styles.nickName}>{user.nickName}</span>
      {role === "USER" ? (
        <button onClick={setRoleAsManager} className={styles.button}>
          <i className={`fas fa-plus ${styles.plus}`}></i>
          매니저로 추가
        </button>
      ) : (
        <span>{role === "MANAGER" ? "매니저" : "관리자"}</span>
      )}
    </div>
  );
}
