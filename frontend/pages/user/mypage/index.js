import styles from "../../../scss/user/mypage.module.scss";
import Link from "next/link";

import { leaveDangDang } from "../../../api/user";
import { BACKEND_URL } from "../../../config";
import { useRouter } from "next/router";
import { connect } from "react-redux";

function mapStateToProps({ userReducer }) {
  const isImgUrlBackendServer = userReducer.user.imageUrl?userReducer.user.imageUrl.slice(0, 5) !== "https":true
  return {
    user: userReducer.user,
  };
}

export default connect(mapStateToProps)(userInfo);

function userInfo({ user, isImgUrlBackendServer }) {
  const router = useRouter();
  //회원 탈퇴
  const onLeaveDangDang = () => {
    leaveDangDang(
      (res) => {
        console.log(res, "당당 탈퇴 성공");
        router.push({
          pathname: "/",
        });
      },
      (err) => {
        console.log(err, "당당 탈퇴 실패");
      }
    );
  };

  return (
    <div className={styles.myPageContainer}>
      <div className={styles.imageBox}>
        <img src={`${user.imageUrl}`} />
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

      <button onClick={onLeaveDangDang} className={styles.noButton}>회원 탈퇴</button>
    </div>
  );
}
