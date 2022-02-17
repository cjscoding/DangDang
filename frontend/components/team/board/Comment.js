import styles from "../../../scss/team/board/detail.module.scss";
import Reply from "./Reply";

import {
  createDetailComment,
  updateDetailComment,
  deleteDetailComment,
} from "../../../api/comment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../../config";
import { connect } from "react-redux";

const mapStateToProps = (state) => {
  return {
    user: state.userReducer.user,
  };
};

export default connect(mapStateToProps, null)(Comment);

function Comment({ comment, reload, user }) {
  const router = useRouter();

  const [showReply, setShowReply] = useState(false);
  const [showUpdateBtn, setShowUpdateBtn] = useState(false);
  const [newComment, setNewComment] = useState(comment.content);
  const [imgUrl, setImageUrl] = useState(null);

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
      studyId: router.query.id,
      obj: {
        parentId: comment.id,
        content: event.target[0].value,
      },
    };
    createDetailComment(
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
      studyId: router.query.id,
      commentId: id,
    };
    deleteDetailComment(
      data,
      (res) => {
        console.log(res, "댓글 삭제 완료");
        reload();
      },
      (err) => {
        console.log(err);
      }
    );
  };

  //댓글 수정
  const onUpdateComment = (event) => {
    event.preventDefault();
    const data = {
      studyId: router.query.id,
      commentId: comment.id,
      obj: {
        content: newComment,
      },
    };

    updateDetailComment(
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

  useEffect(() => {
    if(comment.writerImageUrl === "default.jpg") {
      setImageUrl("default.jpg")
    }else if (comment.writerImageUrl.slice(0, 4) === "http") {
      setImageUrl(comment.writerImageUrl)
    }else {
      setImageUrl(`${BACKEND_URL}/files/images/${comment.writerImageUrl}`)
    }
  }, [])

  return (
    <div className={styles.commentItem}>
      <div className={styles.commentContent}>
        {showUpdateBtn ? (
          <form onSubmit={onUpdateComment} className={styles.commentToggle}>
            <div className={styles.userInfo}>
              <div className={styles.imgBox}>
                {imgUrl !== null &&
                  imgUrl !== "default.jpg" ? (
                  <img
                    src={imgUrl}
                  />
                ) : (
                  <img src="/images/dangdang_1.png" />
                )}
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
              {comment.writerId === user.id ? (
                <>
                  <button type="submit">
                    <i className="fas fa-check"></i>
                  </button>
                  <button type="button" onClick={toggleUpdate}>
                    <i className="fas fa-times"></i>
                  </button>
                </>
              ) : null}
            </div>
          </form>
        ) : (
          <div className={styles.commentToggle}>
            <div className={styles.userInfo}>
              <div className={styles.imgBox}>
                {imgUrl !== null &&
                  imgUrl !== "default.jpg" ? (
                  <img
                    src={imgUrl}
                  />
                ) : (
                  <img src="/images/dangdang_1.png" />
                )}
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
              {comment.writerId === user.id ? (
                <>
                  <button onClick={toggleUpdate}>
                    <i className="fas fa-pen"></i>
                  </button>
                  <button onClick={() => onDeleteComment(comment.id)}>
                    <i className="fas fa-trash"></i>
                  </button>
                </>
              ) : null}
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
              <Reply key={reply.id} reply={reply} submitReload={submitReload} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
