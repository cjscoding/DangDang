import styles from "../../../scss/team/board/comment.module.scss";
import Reply from "./replys";
import { useState } from "react";

export default function Comment({ comment }) {
  const [showReply, setShowReply] = useState(false);

  function toggleReply(event) {
    event.preventDefault();
    setShowReply((showReply) => !showReply);
  }

  return (
    <div>
      <div className={styles.commentBox}>
        <span>이름 : {comment.writerNickname}</span>
        <span>내용 : {comment.content}</span>
        <div className={styles.btns}>
          <button onClick={toggleReply}>대댓글</button>
          <button>수정</button>
          <button>삭제</button>
        </div>
      </div>
      {showReply ? (
        <div>
          <h1>Reply</h1>
          <form>
            <input type="text" placeholder="reply..." />
            <button type="submit">Upload</button>
          </form>
          {comment.children?.map((reply, index) => (
            <div key={index}>
              <Reply reply={reply} />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
