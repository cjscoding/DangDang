import Link from "next/link";
import { useState } from "react";
import styles from "../scss/layout/navbar.module.scss";
import Modal from "./layout/Modal";
import Login from "./user/Login";
import Signup from "./user/Signup";

export default function NavBar() {
  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const onClick = () => setIsLogin((curr) => !curr);

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
            <a>마이페이지</a>
          </Link>
        </li>
        <li>
          <a tabIndex="0">로그아웃</a>
        </li>
      </ul>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        {isLogin ? (
          <Login onClick={onClick}></Login>
        ) : (
          <Signup onClick={onClick}></Signup>
        )}
      </Modal>
    </nav>
  );
}
