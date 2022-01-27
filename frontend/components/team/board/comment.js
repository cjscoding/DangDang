import styles from "../../../scss/team/board/comment.module.scss";
import Reply from "./replys";
import { useState } from "react";

export default function Comment({ comments }) {
  const [showReply, setShowReply] = useState(false);

  function toggleReply(event) {
    event.preventDefault();
    setShowReply((showReply) => !showReply);
  }
  return (
    <div>
      <h1>Comments</h1>

      {/* 임시 */}
      <div className={styles.commentBox}>
        <div className={styles.text}>
          <span>지수</span>
          <span>지수 코멘트..</span>
        </div>
        <Reply on={showReply} />
        <div className={styles.btns}>
          <button onClick={toggleReply}>대댓글</button>
          <button>수정</button>
          <button>삭제</button>
        </div>
      </div>
      <div className={styles.commentBox}>
        <div className={styles.text}>
          <span>보리</span>
          <span>보리 코멘트..</span>
        </div>
        <Reply on={showReply} />
        <div className={styles.btns}>
          <button onClick={toggleReply}>대댓글</button>
          <button>수정</button>
          <button>삭제</button>
        </div>
      </div>
      {/* 임시 */}

      {comments?.map((comment) => {
        <div className="comment">
          <span>{comment.user}</span>
          <span>{comment.content}</span>
        </div>;
      })}
    </div>
  );
}
