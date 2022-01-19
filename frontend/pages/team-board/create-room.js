import styles from "../../scss/team-board/board.module.scss";
import Title from "../../components/layout/title";
import Link from "next/link";

export default function CreateRoom() {
  return (
    <div className={styles.container}>
      <Title title="Create Room"></Title>
      <h1>방 생성</h1>

      <div className={styles.info}>
        <span>호스트</span>
        <input type="text" />
        <span>직무(분야)</span>
        <input type="text" />
        <span>오카방 링크</span>
        <input type="text" />
        <span>팀 소개</span>
        <textarea name="" id="" cols="30" rows="10"></textarea>
        <label>태그</label>
        <div className={styles.tag}>
          <input type="" />
          <button>태그 추가</button>
        </div>
      </div>

      <div className={styles.btns}>
        <button className="cancelBtn">
          <Link href="/board">
            <a>취소</a>
          </Link>
        </button>
        <button className="createBtn">생성</button>
      </div>
    </div>
  );
}
