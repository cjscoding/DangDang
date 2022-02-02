import styles from "../../../scss/team/board/comment.module.scss";
import Reply from "./replys";

import { createDetailComment } from "../../../store/actions/roomAction";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Comment({ comment, reload }) {
  const router = useRouter();
  const [showReply, setShowReply] = useState(false);

  function toggleReply(event) {
    event.preventDefault();
    setShowReply((showReply) => !showReply);
  }

  //대댓글 등록
  const onUploadComment = (event) => {
    event.preventDefault();
    const data = {
      studyId: router.query.id,
      obj: {
        parentId: comment.id,
        content: event.target[0].value,
      },
    };
    createDetailComment(data);
    event.target[0].value = "";
    reload();
  };

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
          <form onSubmit={onUploadComment}>
            <input type="text" placeholder="reply..." />
            <button>Upload</button>
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
