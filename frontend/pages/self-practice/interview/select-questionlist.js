import Link from "next/link";
import styles from "../../../scss/self-practice/interview/select-questionlist.module.scss";

export default function SelectQuestions() {
  return <div className={styles.selectBox}>
    <Link href="/self-practice/interview/check-devices">
      <a>
        <div className={styles.borderBox}>
          <h1>기본 질문</h1>
          <p>최첨단 알고리즘을 사용해, 질문을 엄선했습니다.</p>
        </div>
      </a>
    </Link>
    <Link href="/self-practice/interview/add-questions">
      <a>
        <div className={styles.borderBox}>
          <h1>질문 선택</h1>
          <p>원하는 질문들을 직접 선택하여, 면접을 연습해보세요!</p>
        </div>
      </a>
    </Link>
  </div>
}