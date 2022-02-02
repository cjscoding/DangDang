// import styles from "../../scss/team/board/reply.module.scss";

export default function Reply({ reply }) {
  return (
    <div className="reply">
      <span>이름 : {reply.writerNickname}</span>
      <span>내용 : {reply.content}</span>
      <div>
          <button>수정</button>
          <button>삭제</button>
        </div>
    </div>
  );
}
