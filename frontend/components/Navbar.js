import Link from "next/link";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import { logoutRequest } from "../api/user";
import {
  resetUserInfo,
  setIsLoginModal,
  setShowModal,
} from "../store/actions/userAction";
import styles from "../scss/layout/navbar.module.scss";
import Modal from "./layout/Modal";
import Login from "./user/Login";
import Signup from "./user/Signup";
import { useEffect, useState } from "react";

function mapStateToProps({ userReducer }) {
  return {
    user: userReducer.user,
    isLoginModal: userReducer.isLoginModal,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setShowModal: (show) => dispatch(setShowModal(show)),
    setIsLoginModal: (isLoginModal) => dispatch(setIsLoginModal(isLoginModal)),
    resetUserInfo: () => dispatch(resetUserInfo()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);

function NavBar({
  user,
  isLoginModal,
  setShowModal,
  setIsLoginModal,
  resetUserInfo,
}) {
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

  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem("authorization") &&
      localStorage.getItem("refreshtoken")
    ) {
      setIsLogin(true);
    } else setIsLogin(false);
  }, [user]);

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
          <Link href="/user/mypage/myroom">
            <a>같이연습한당</a>
          </Link>
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
        {isLogin ? (
          <span>
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
          </span>
        ) : (
          <span>
            <li>
              <a
                onClick={() => {
                  setShowModal(true);
                  setIsLoginModal(true);
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
                }}
                tabIndex="0"
              >
                회원가입
              </a>
            </li>
          </span>
        )}
      </ul>

      <Modal>{isLoginModal ? <Login></Login> : <Signup></Signup>}</Modal>
    </nav>
  );
}
