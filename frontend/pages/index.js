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
      <div className={styles.title}>
        <img src="/images/logo.png" />
        <h1>하게 면접보자!</h1>
      </div>
      <nav className={styles.menuContainer}>
        <Link href="/self-practice">
          <a>
            <MainComponent
              title={"혼자\n 연습한당"}
              content={
                "연습하고 싶은 질문을 골라서\n 내 마음에 들 때까지\n 무한 반복 1인 연습 모드"
              }
              menu={"selfStudy"}
            />
          </a>
        </Link>
        {isLogin ? (
          <Link href="/user/mypage/myroom">
            <a>
              <MainComponent
                title={"같이\n 연습한당"}
                content={
                  "면접관 - 지원자가 되어\n 스터디원들과\n 모의 면접 연습 모드"
                }
                menu={"teamStudy"}
              />
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
            <MainComponent
              title={"같이\n 연습한당"}
              content={
                "면접관 - 지원자가 되어\n 스터디원들과\n 모의 면접 연습 모드"
              }
              menu={"teamStudy"}
            />
          </a>
        )}
        <Link href="/team/board">
          <a>
            <MainComponent
              title={"스터디\n 구한당"}
              content={"같은 목표를 향해.\n 면접 스터디 구인 게시판"}
              menu={"teamBoard"}
            />
          </a>
        </Link>
        <Link href="/interview-question">
          <a>
            <MainComponent
              title={"질문\n궁금하당"}
              content={"면접 빈출 질문들을\n 한눈에 모아보세요"}
              menu={"interviewQuestion"}
            />
          </a>
        </Link>
      </nav>

      <Modal>{isLoginModal ? <Login></Login> : <Signup></Signup>}</Modal>
    </main>
  );
}
