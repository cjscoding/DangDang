// import styles from "../../scss/team/board/reply.module.scss";

import { updateDetailComment, deleteDetailComment } from "../../../api/comment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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
    <div className="reply">
      {showUpdateBtn ? (
        <form onSubmit={onUpdateReply}>
          <div className="content">
            <span>이름 : {reply.writerNickname}</span>
            <label htmlFor="content">내용</label>
            <input
              type="text"
              name="content"
              value={newReply}
              onChange={onChangeReply}
            />
          </div>
          <div>
            <button type="submit">수정완료</button>
            <button type="button" onClick={toggleUpdate}>
              취소
            </button>
          </div>
        </form>
      ) : (
        <div>
          <span>이름 : {reply.writerNickname}</span>
          <span>내용 : {reply.content}</span>
          <div>
            <button onClick={toggleUpdate}>수정</button>
            <button onClick={() => onDeleteReply(reply.id)}>삭제</button>
          </div>
        </div>
      )}
    </div>
  );
}
