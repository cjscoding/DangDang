import { useRouter } from "next/router";
import { connect } from "react-redux";
import { logoutRequest } from "../api/user";
import {
  resetUserInfo,
  setIsLoginModal,
  setShowModal,
  setIsLogin,
  setIsMoveTeamStudy,
} from "../store/actions/userAction";
import { setMyRooms } from "../store/actions/roomAction";

import Link from "next/link";
import styles from "../scss/layout/navbar.module.scss";
import Modal from "./layout/Modal";
import Login from "./user/Login";
import Signup from "./user/Signup";

function mapStateToProps({ userReducer }) {
  return {
    user: userReducer.user,
    isLogin: userReducer.isLogin,
    isLoginModal: userReducer.isLoginModal,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setShowModal: (show) => dispatch(setShowModal(show)),
    setIsLoginModal: (isLoginModal) => dispatch(setIsLoginModal(isLoginModal)),
    resetUserInfo: () => dispatch(resetUserInfo()),
    setIsLogin: (isLogin) => dispatch(setIsLogin(isLogin)),
    setIsMoveTeamStudy: (isMoveTeamStudy) =>
      dispatch(setIsMoveTeamStudy(isMoveTeamStudy)),
    setMyRooms: (myRoomList) => dispatch(setMyRooms(myRoomList)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);

function NavBar({
  user,
  isLogin,
  setIsLogin,
  isLoginModal,
  setShowModal,
  setIsLoginModal,
  resetUserInfo,
  setIsMoveTeamStudy,
  setMyRooms,
}) {
  const router = useRouter();

  const logOut = () => {
    logoutRequest(
      (response) => {
        localStorage.removeItem("authorization");
        localStorage.removeItem("refreshtoken");

        // 로그아웃 시 삭제해야 하는 store 값들 추가로 삭제 바람!
        resetUserInfo();
        setIsLogin(false);
        const myRoomList = {
          myRooms: [],
          myRoomsCount: 0,
        };
        setMyRooms(myRoomList);
        router.push("/");
      },
      (error) => console.log(error)
    );
  };

  return (
    <nav className={styles.navbar}>
      <ul>
        <Link href="/">
          <div className={styles.logo}>
            <a>
              <li> </li>
            </a>
          </div>
        </Link>
        <div className={styles.menu}>
          <li>
            <Link href="/self-practice">
              <a>혼자연습한당</a>
            </Link>
          </li>
          <li>
            {isLogin ? (
              <Link href="/user/mypage/myroom">
                <a>같이연습한당</a>
              </Link>
            ) : (
              <a
                onClick={() => {
                  setShowModal(true);
                  setIsLoginModal(true);
                  setIsMoveTeamStudy(true);
                  document.body.style.overflow = "hidden";
                }}
                tabIndex="0"
              >
                같이연습한당
              </a>
            )}
          </li>
          <li>
            <Link href="/team/board">
              <a>스터디구한당</a>
            </Link>
          </li>
          <li>
            <Link href="/interview-question">
              <a>질문궁금하당</a>
            </Link>
          </li>
        </div>
        {isLogin ? (
          <div className={styles.user}>
            {user.role === "USER" ? null : (
              <li>
                <Link href="/admin">
                  <a>관리자페이지</a>
                </Link>
              </li>
            )}
            <li>
              <Link href="/user/mypage">
                <a>마이페이지</a>
              </Link>
            </li>
            <li>
              <a tabIndex="0" onClick={logOut}>
                로그아웃
              </a>
            </li>
          </div>
        ) : (
          <div className={styles.user}>
            <li>
              <a
                onClick={() => {
                  setShowModal(true);
                  setIsLoginModal(true);
                  document.body.style.overflow = "hidden";
                }}
                tabIndex="0"
              >
                로그인
              </a>
            </li>
            <li>
              <a
                onClick={() => {
                  setShowModal(true);
                  setIsLoginModal(false);
                  document.body.style.overflow = "hidden";
                }}
                tabIndex="0"
              >
                회원가입
              </a>
            </li>
          </div>
        )}
      </ul>

      <Modal>{isLoginModal ? <Login></Login> : <Signup></Signup>}</Modal>
    </nav>
  );
}
