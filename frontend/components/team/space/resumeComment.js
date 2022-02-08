import styles from "../../../scss/team/board/comment.module.scss";
import Reply from "./ResumeReply";

import {
  createResumeComment,
  updateResumeComment,
  deleteResumeComment,
} from "../../../api/resume";
import { useEffect, useState } from "react";

export default function Comment({ comment, reload, resumeId, userName }) {
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
    <div>
      <div>
        {showUpdateBtn ? (
          <form className={styles.commentBox} onSubmit={onUpdateComment}>
            <span>이름 : {comment.writerNickname}</span>
            <div className="content">
              <label htmlFor="content">내용</label>
              <input
                type="text"
                name="content"
                value={newComment}
                onChange={onChangeComment}
              />
            </div>
            <div className={styles.btns}>
              <button type="button" onClick={toggleReply}>
                대댓글
              </button>
              <button type="submit">수정완료</button>
              <button type="button" onClick={toggleUpdate}>
                취소
              </button>
            </div>
          </form>
        ) : (
          <div className={styles.commentBox}>
            <span>이름 : {comment.writerNickname}</span>
            <span>내용 : {comment.content}</span>
            <div className={styles.btns}>
              <button onClick={toggleReply}>대댓글</button>
              <button onClick={toggleUpdate}>수정</button>
              <button onClick={() => onDeleteComment(comment.id)}>삭제</button>
            </div>
          </div>
        )}
      </div>
      {showReply ? (
        <div>
          <h5>Reply</h5>
          <h6> {userName}</h6>
          <form onSubmit={onUploadReply}>
            <input type="text" placeholder="reply..." />
            <button>Upload</button>
          </form>
          {comment.children?.map((reply, index) => (
            <div key={index}>
              <Reply
                reply={reply}
                submitReload={submitReload}
                resumeId={resumeId}
                commentId={comment.id}
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
