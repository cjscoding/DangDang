import Link from "next/link";
import styles from "../../scss/team-space/layout.module.scss";
export default function layout() {
  return (
    <div>
      <div className={styles.preview}>
        <div className={styles.image}>이미지</div>
        <div className={styles.details}>
          <span>팀명</span>
          <span>팀설명</span>
          <span>팀목표</span>
          <span>호스트</span>
          <span>팀원</span>
        </div>
        <div className={styles.etc}>
          <span>개설일</span>
          <button>스터디 시작</button>
        </div>
      </div>
      <div className={styles.menus}>
        <Link href="/team-space">
          <a>팀 소개 | </a>
        </Link>
        <Link href="/team-space/coverletter">
          <a>자소서 | </a>
        </Link>
        <Link href="/team-space/board">
          <a>게시판</a>
        </Link>
      </div>
    </div>
  );
}
