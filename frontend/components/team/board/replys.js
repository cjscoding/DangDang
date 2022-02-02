// import styles from "../../scss/team/board/reply.module.scss";

import {
  fetchRoomInfo,
  deleteDetailComment,
} from "../../../store/actions/roomAction";
import { useRouter } from "next/router";
import { connect } from "react-redux";

function mapDispatchToProps(dispatch) {
  return {
    getRoomInfo: (id) => {
      const data = fetchRoomInfo(id);
      data.then((res) => {
        dispatch(res);
      });
    },
  };
}

export default connect(null, mapDispatchToProps)(Reply);

function Reply({ reply, getRoomInfo }) {
  const router = useRouter();
  //댓글 삭제
  const onDeleteReply = (id) => {
    const data = {
      studyId: router.query.id,
      commentId: id,
    };
    deleteDetailComment(data);
  };

  return (
    <div className="reply">
      <span>이름 : {reply.writerNickname}</span>
      <span>내용 : {reply.content}</span>
      <div>
        <button>수정</button>
        <button onClick={() => onDeleteReply(reply.id)}>삭제</button>
      </div>
    </div>
  );
}
