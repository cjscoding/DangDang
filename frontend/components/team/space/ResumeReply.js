import styles from "../../../scss/team/space/resume.module.scss";

import { updateResumeComment, deleteResumeComment } from "../../../api/resume";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../../config";
import { connect } from "react-redux";

const mapStateToProps = (state) => {
  return {
    user: state.userReducer.user,
  };
};

export default connect(mapStateToProps, null)(ResumeReply);

function ResumeReply({ reply, submitReload, resumeId, commentId, user }) {
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
      resumeId,
      commentId: id,
    };
    deleteResumeComment(
      data,
      (res) => {
        console.log(res, "대댓글 삭제 완료");
        submitReload();
      },
      (err) => {
        console.log(err, "대댓글 삭제 실패");
      }
    );
  };

  //대댓글 수정
  const onChangeReply = (event) => setNewReply(event.target.value);

  const onUpdateReply = (event) => {
    event.preventDefault();
    const data = {
      resumeId,
      commentId: reply.id,
      obj: {
        parentId: commentId,
        content: newReply,
      },
    };
    updateResumeComment(
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

          {reply.writerId === user.id ? (
            <div className={styles.btnBox}>
              <button type="submit">
                <i className="fas fa-check"></i>
              </button>
              <button type="button" onClick={toggleUpdate}>
                <i className="fas fa-times"></i>
              </button>
            </div>
          ) : null}
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
          {reply.writerId === user.id ? (
            <div className={styles.btnBox}>
              <button onClick={toggleUpdate}>
                <i className="fas fa-pen"></i>
              </button>
              <button onClick={() => onDeleteReply(reply.id)}>
                <i className="fas fa-trash"></i>
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
