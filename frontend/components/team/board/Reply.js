import styles from "../../../scss/team/board/detail.module.scss";

import { updateDetailComment, deleteDetailComment } from "../../../api/comment";
import { BACKEND_URL } from "../../../config";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Reply({ reply, submitReload }) {
  const router = useRouter();

  const [showUpdateBtn, setShowUpdateBtn] = useState(false);
  const [newReply, setNewReply] = useState(reply.content);

  const toggleUpdate = () =>
    setShowUpdateBtn((showUpdateBtn) => !showUpdateBtn);

  useEffect(() => {
    setNewReply(reply.content);
  }, [reply]);

  //대댓글 삭제
  const onDeleteReply = (id) => {
    const data = {
      studyId: router.query.id,
      commentId: id,
    };
    deleteDetailComment(
      data,
      (res) => {
        console.log(res, "대댓글 삭제 완료");
        submitReload();
      },
      (err) => {
        console.log(err, "대댓글 삭제 실패");
        alert("본인의 대댓글만 수정이 가능합니다.");
      }
    );
  };

  //대댓글 수정
  const onChangeReply = (event) => setNewReply(event.target.value);

  const onUpdateReply = (event) => {
    event.preventDefault();
    const data = {
      commentId: reply.id,
      obj: {
        content: newReply,
      },
    };
    updateDetailComment(
      data,
      (res) => {
        console.log(res, "대댓글 완료");
        toggleUpdate();
        submitReload();
      },
      (err) => {
        console.log(err, "대댓글 실패");
      }
    );
  };

  return (
    <div className={styles.replyContent}>
      {showUpdateBtn ? (
        <form onSubmit={onUpdateReply} className={styles.commentToggle}>
          <div className={styles.userInfo}>
            <div className={styles.imgBox}>
              {reply.writerImageUrl !== null &&
              reply.writerImageUrl !== "default.jpg" ? (
                <img
                  src={`${BACKEND_URL}/files/images/${reply.writerImageUrl}`}
                />
              ) : (
                <img src="/images/dangdang_1.png" />
              )}
            </div>
            <span>{reply.writerNickname}</span>
          </div>

          <div className={styles.contentBox}>
            <input
              type="text"
              name="content"
              value={newReply}
              onChange={onChangeReply}
              autoFocus
            />
          </div>

          <div className={styles.btnBox}>
            <button type="submit">
              <i className="fas fa-check"></i>
            </button>
            <button type="button" onClick={toggleUpdate}>
              <i className="fas fa-times"></i>
            </button>
          </div>
        </form>
      ) : (
        <div className={styles.commentToggle}>
          <div className={styles.userInfo}>
            <div className={styles.imgBox}>
              {reply.writerImageUrl !== null &&
              reply.writerImageUrl !== "default.jpg" ? (
                <img
                  src={`${BACKEND_URL}/files/images/${reply.writerImageUrl}`}
                />
              ) : (
                <img src="/images/dangdang_1.png" />
              )}
            </div>
            <span>{reply.writerNickname}</span>
          </div>

          <div className={styles.contentBox}>
            <p>{reply.content}</p>
          </div>

          <div className={styles.btnBox}>
            <button onClick={toggleUpdate}>
              <i className="fas fa-pen"></i>
            </button>
            <button onClick={() => onDeleteReply(reply.id)}>
              <i className="fas fa-trash"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

//
