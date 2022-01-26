import Link from "next/link";
import { connect } from "react-redux";
import { setIsLogin, setShowModal } from "../store/actions/userAction";
import styles from "../scss/layout/navbar.module.scss";
import Modal from "./layout/Modal";
import Login from "./user/Login";
import Signup from "./user/Signup";

function mapStateToProps({ userReducer }) {
  return {
    user: userReducer.user,
    showModal: userReducer.showModal,
    isLogin: userReducer.isLogin,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setShowModal: (show) => dispatch(setShowModal(show)),
    setIsLogin: (isLogin) => dispatch(setIsLogin(isLogin)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);

function NavBar({ user, showModal, setShowModal, isLogin, setIsLogin }) {
  // const [showModal, setShowModal] = useState(false);
  // const [isLogin, setIsLogin] = useState(false);
  const onClick = () => setIsLogin((curr) => !curr);
  const onClose = () => setShowModal(false);

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
          <a tabIndex="0">로그아웃</a>
        </li>
      </ul>

      <Modal show={showModal} onClose={onClose}>
        {isLogin ? <Login></Login> : <Signup></Signup>}
      </Modal>
    </nav>
  );
}
