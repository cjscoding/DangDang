export default function Comment({ comments }) {
  return (
    <div>
      {comments?.map((comment) => {
        <div className="comment">
          <span>{comment.user}</span>
          <span>{comment.content}</span>
        </div>;
      })}
    </div>
  );
}
