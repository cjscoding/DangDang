import styles from "../../../scss/team/board/detail.module.scss";

import { updateDetailComment, deleteDetailComment } from "../../../api/comment";
import { BACKEND_URL } from "../../../config";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";

const mapStateToProps = (state) => {
  return {
    user: state.userReducer.user,
  };
};

export default connect(mapStateToProps, null)(Reply);

function Reply({ reply, submitReload, user }) {
  const router = useRouter();

  const [showUpdateBtn, setShowUpdateBtn] = useState(false);
  const [newReply, setNewReply] = useState(reply.content);
  const [imgUrl, setImageUrl] = useState(null);
  
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

  useEffect(() => {
    if(reply.writerImageUrl === "default.jpg") {
      setImageUrl("default.jpg")
    }else if (reply.writerImageUrl.slice(0, 4) === "http") {
      setImageUrl(reply.writerImageUrl)
    }else {
      setImageUrl(`${BACKEND_URL}/files/images/${reply.writerImageUrl}`)
    }
  }, [])

  return (
    <div className={styles.replyContent}>
      {showUpdateBtn ? (
        <form onSubmit={onUpdateReply} className={styles.commentToggle}>
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
              {imgUrl !== null &&
                imgUrl !== "default.jpg" ? (
                <img
                  src={imgUrl}
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

//
