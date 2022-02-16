import styles from "../../../scss/user/mypage.module.scss";
import Link from "next/link";

import { leaveDangDang } from "../../../api/user";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import { BACKEND_URL } from "../../../config";

function mapStateToProps({ userReducer }) {
  return {
    user: userReducer.user,
  };
}

export default connect(mapStateToProps)(userInfo);

function userInfo({ user }) {
  const router = useRouter();
  //회원 탈퇴
  const onLeaveDangDang = () => {
    leaveDangDang(
      (res) => {
        alert("탈퇴 완료되었습니다.");
        console.log(res, "당당 탈퇴 성공");
        router.push({
          pathname: "/",
        });
      },
      (err) => {
        alert("탈퇴가 완료되지 않았습니다.");
        console.log(err, "당당 탈퇴 실패");
      }
    );
  };

  console.log(user.imageUrl);

  return (
    <div className={styles.myPageContainer}>
      <div className={styles.imageBox}>
        {user.imageUrl !== null &&
        user.imageUrl !== `${BACKEND_URL}/files/images/default.jpg` ? (
          <img src={`${user.imageUrl}`} />
        ) : (
          <img src="/images/dangdang_1.png" />
        )}
      </div>

      <div className={styles.info}>
        <div className={styles.top}>
          <p>{user.nickName}</p>

          <Link href="/user/mypage/edit">
            <button>
              <i className="fas fa-pen"></i>
            </button>
          </Link>
        </div>

        <p className={styles.email}>{user.email}</p>

        <Link href="/user/mypage/myroom">
          <a className={styles.linkBtn}>내 스터디 보기</a>
        </Link>
      </div>

      <button onClick={onLeaveDangDang} className={styles.noButton}>
        회원 탈퇴
      </button>
    </div>
  );
}
