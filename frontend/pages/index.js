import Link from "next/link";
import { connect } from "react-redux";
import MainComponent from "../components/MainComponent";
import styles from "../scss/home.module.scss";
import Modal from "../components/layout/Modal";
import Login from "../components/user/Login";
import Signup from "../components/user/Signup";
import {
  setShowModal,
  setIsLoginModal,
  setIsMoveTeamStudy,
} from "../store/actions/userAction";

function mapStateToProps({ userReducer }) {
  return {
    isLogin: userReducer.isLogin,
    isLoginModal: userReducer.isLoginModal,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setShowModal: (show) => dispatch(setShowModal(show)),
    setIsLoginModal: (isLoginModal) => dispatch(setIsLoginModal(isLoginModal)),
    setIsMoveTeamStudy: (isMoveTeamStudy) =>
      dispatch(setIsMoveTeamStudy(isMoveTeamStudy)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);

function Home({
  isLogin,
  isLoginModal,
  setIsLoginModal,
  setShowModal,
  setIsMoveTeamStudy,
}) {
  return (
    <main className={styles.container}>
      <h1>당당하게 면접보자!</h1>
      <nav className={styles.menuContainer}>
        <Link href="/self-practice">
          <a>
            <MainComponent content={"혼자연습한당"} />
          </a>
        </Link>
        {isLogin ? (
          <Link href="/user/mypage/myroom">
            <a>
              <MainComponent content={"같이연습한당"} />
            </a>
          </Link>
        ) : (
          <a
            onClick={() => {
              setShowModal(true);
              setIsLoginModal(true);
              setIsMoveTeamStudy(true);
            }}
            tabIndex="0"
          >
            <MainComponent content={"같이연습한당"} />
          </a>
        )}
        <Link href="/team/board">
          <a>
            <MainComponent content={"스터디구한당"} />
          </a>
        </Link>
        <Link href="/interview-question">
          <a>
            <MainComponent content={"질문궁금하당"} />
          </a>
        </Link>
      </nav>

      <Modal>{isLoginModal ? <Login></Login> : <Signup></Signup>}</Modal>
    </main>
  );
}
