import Link from "next/link";
import MainComponent from "../components/MainComponent";
import styles from "../scss/home.module.scss";

export default function Home() {
  return (
    <main className={styles.container}>
      <h1>당당하게 면접보자!</h1>
      <nav className={styles.menuContainer}>
        <Link href="/self-practice">
          <a>
            <MainComponent content={"혼자연습한당"} />
          </a>
        </Link>
        <Link href="/user/mypage/myroom">
          <a>
            <MainComponent content={"같이연습한당"} />
          </a>
        </Link>
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
    </main>
  );
}
