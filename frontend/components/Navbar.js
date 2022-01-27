import Link from "next/link";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import { logoutRequest } from "../api/user";
import {
  resetUserInfo,
  setIsLogin,
  setShowModal,
} from "../store/actions/userAction";
import styles from "../scss/layout/navbar.module.scss";
import Modal from "./layout/Modal";
import Login from "./user/Login";
import Signup from "./user/Signup";

function mapStateToProps({ userReducer }) {
  return {
    user: userReducer.user,
    isLogin: userReducer.isLogin,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setShowModal: (show) => dispatch(setShowModal(show)),
    setIsLogin: (isLogin) => dispatch(setIsLogin(isLogin)),
    resetUserInfo: () => dispatch(resetUserInfo()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);

function NavBar({ user, isLogin, setShowModal, setIsLogin, resetUserInfo }) {
  const router = useRouter();
  const logOut = () => {
    logoutRequest(
      (response) => {
        console.log(response);
        localStorage.removeItem("authorization");
        localStorage.removeItem("refreshtoken");

        // 로그아웃 시 삭제해야 하는 store 값들 추가로 삭제 바람!
        resetUserInfo();
        router.push("/");
      },
      (error) => console.log(error)
    );
  };

  return (
    <nav className={styles.navbar}>
      <ul>
        <li>
          <Link href="/">
            <a>Home</a>
          </Link>
        </li>
        <li>
          <Link href="/self-practice">
            <a>혼자연습한당</a>
          </Link>
        </li>
        <li>
          <Link href="/team-space">
            <a>같이연습한당</a>
          </Link>
        </li>
        <li>
          <Link href="/team-board">
            <a>스터디구한당</a>
          </Link>
        </li>
        <li>
          <Link href="/interview-question">
            <a>질문궁금하당</a>
          </Link>
        </li>
        <li>
          <a
            onClick={() => {
              setShowModal(true);
              setIsLogin(true);
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
              setIsLogin(false);
            }}
            tabIndex="0"
          >
            회원가입
          </a>
        </li>
        <li>
          <Link href="/user">
            <a>{user.nickName}님 안녕하세요! (마이페이지)</a>
          </Link>
        </li>
        <li>
          <a tabIndex="0" onClick={logOut}>
            로그아웃
          </a>
        </li>
      </ul>

      <Modal>{isLogin ? <Login></Login> : <Signup></Signup>}</Modal>
    </nav>
  );
}
