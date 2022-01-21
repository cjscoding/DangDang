import styles from "../../scss/team-board/reply.module.scss";

export default function Replys({ replys, on }) {
  return (
    <div>
      {on ? (
        <div>
          <h1>Replys</h1>
          <form>
            <input
              type="text"
              placeholder="reply..."
            />
            <button type="submit">Upload</button>
          </form>
        </div>
      ) : null}

      {replys?.map((reply) => {
        <div className="reply">
          <span>{reply.user}</span>
          <span>{reply.content}</span>
        </div>;
      })}
    </div>
  );
}
