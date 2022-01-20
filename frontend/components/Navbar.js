import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../scss/layout/navbar.module.scss";

export default function NavBar() {
  const router = useRouter();
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
          <a>로그인</a>
        </li>
        <li>
          <a>회원가입</a>
        </li>
        <li>
          <a>마이페이지</a>
        </li>
        <li>
          <a>로그아웃</a>
        </li>
      </ul>
    </nav>
  );
}
