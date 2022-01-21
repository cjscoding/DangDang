import styles from "../../scss/team-board/team-detail.module.scss";
import Comment from "../../components/team-board/comment";
import { connect } from "react-redux";

function mapStateToProps(state) {
  return {
    comments: state.roomReducer.rooms,
  };
}

function mapDispatchToProps() {
  return {
    addComment: (newComment) => dispatchEvent(addComment(newComment)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamDetail);

function TeamDetail() {
  return (
    <div>
      <h1>룸넘버 | 룸네임</h1>

      <button>가입신청</button>
      <div className={styles.info}>
        <span>호스트</span>
        <p>jisu</p>

        <span>목표</span>
        <p>sdsfdsfsdfasf</p>

        <span>오카방 주소</span>
        <p>sadfsdfsaf</p>

        <span>팀 소개</span>
        <p>sdfsfasfsfasdfsdfsfafsfasfdasfdasf</p>

        <label>태그</label>
        <div>
          <span># fe </span>
          <span># fe </span>
          <span># fe </span>
          <span># fe </span>
        </div>
      </div>
      <div className={styles.comment}>
        <h2>궁금하당</h2>
        <h3 className={styles.comment_title}>New Comment</h3>
        <div className={styles.type}>
          <div className="user">
            <div className="icon"></div>
            <label className="author">me</label>
          </div>
          <form className="input_area">
            <input
              type="text"
              className="type_input"
              placeholder="comment..."
            />
            <button type="submit">Upload</button>
          </form>
        </div>
        <div className="comments_list">
          <h3>Comments</h3>
          <div>
            <Comment />
          </div>
        </div>
      </div>
    </div>
  );
}
