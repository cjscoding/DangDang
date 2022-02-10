import styles from "../../../scss/team/space/resume.module.scss";
import Reply from "./ResumeReply";

import {
  createResumeComment,
  updateResumeComment,
  deleteResumeComment,
} from "../../../api/resume";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../../config";

export default function Comment({
  comment,
  reload,
  resumeId,
  userName,
  userImage,
}) {
  const [showReply, setShowReply] = useState(false);
  const [showUpdateBtn, setShowUpdateBtn] = useState(false);
  const [newComment, setNewComment] = useState(comment.content);

  const toggleReply = () => setShowReply((showReply) => !showReply);
  const toggleUpdate = () =>
    setShowUpdateBtn((showUpdateBtn) => !showUpdateBtn);

  useEffect(() => {
    setNewComment(comment.content);
  }, [comment]);

  //대댓글 등록
  const onUploadReply = (event) => {
    event.preventDefault();
    const data = {
      resumeId,
      obj: {
        parentId: comment.id,
        content: event.target[0].value,
      },
    };
    createResumeComment(
      data,
      (res) => {
        console.log(res, "대댓글 등록 완료");
        reload();
      },
      (err) => {
        console.log(err, "대댓글 등록 실패");
      }
    );
    event.target[0].value = "";
  };

  //댓글 삭제
  const onDeleteComment = (id) => {
    const data = {
      resumeId,
      commentId: id,
    };
    deleteResumeComment(
      data,
      (res) => {
        console.log(res, "댓글 삭제 완료");
        reload();
      },
      (err) => {
        console.log(err, "댓글 삭제 실패");
      }
    );
  };

  //댓글 수정
  const onUpdateComment = (event) => {
    event.preventDefault();
    const data = {
      resumeId,
      commentId: comment.id,
      obj: {
        content: newComment,
      },
    };
    updateResumeComment(
      data,
      (res) => {
        console.log(res, "댓글 수정 완료");
        toggleUpdate();
        reload();
      },
      (err) => {
        console.log(err, "댓글 수정 실패");
      }
    );
  };

  const onChangeComment = (event) => setNewComment(event.target.value);
  const submitReload = () => reload();

  return (
    <div className={styles.commentItem}>
      <div className={styles.commentContent}>
        {showUpdateBtn ? (
          <form onSubmit={onUpdateComment} className={styles.commentToggle}>
            <div className={styles.userInfo}>
              <div className={styles.imgBox}>
                <img src={`${BACKEND_URL}/files/images/${comment.writerImageUrl}`} alt="" />
              </div>
              <span>{comment.writerNickname}</span>
            </div>

            <div className={styles.contentBox}>
              <input
                className={styles.commentInput}
                type="text"
                name="content"
                value={newComment}
                onChange={onChangeComment}
                autoFocus
              />
            </div>

            <div className={styles.btnBox}>
              <button type="button" onClick={toggleReply}>
                <i className="fas fa-reply"></i>
              </button>
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
                <img src={`${BACKEND_URL}/files/images/${userImage}`} alt="" />
              </div>
              <span>{comment.writerNickname}</span>
            </div>

            <div className={styles.contentBox}>
              <p>{comment.content}</p>
            </div>

            <div className={styles.btnBox}>
              <button onClick={toggleReply}>
                <i className="fas fa-reply"></i>
              </button>
              <button onClick={toggleUpdate}>
                <i className="fas fa-pen"></i>
              </button>
              <button onClick={() => onDeleteComment(comment.id)}>
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        )}
      </div>

      {showReply ? (
        <div className={styles.replyContainer}>
          <form onSubmit={onUploadReply}>
            <input type="text" placeholder="대댓글을 남겨주세요..." />
            <button>등록</button>
          </form>
          <div className={styles.replyList}>
            {comment.children?.map((reply) => (
              <Reply
                key={reply.id}
                reply={reply}
                submitReload={submitReload}
                resumeId={resumeId}
                commentId={comment.id}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

//
