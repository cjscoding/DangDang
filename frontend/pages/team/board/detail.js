import styles from "../../../scss/team/board/detail.module.scss";
import Comment from "../../../components/team/board/comment";

import { setRoomInfo } from "../../../store/actions/roomAction";
import { getRoomInfo } from "../../../api/studyroom";
import { joinTeam } from "../../../api/member";
import { createDetailComment } from "../../../api/comment";

import { useRouter } from "next/router";
import { connect } from "react-redux";
import { useEffect } from "react";

const mapStateToProps = (state) => {
  return {
    roomInfo: state.roomReducer.curRoomInfo,
    roomHost: state.roomReducer.curRoomHost,
    comments: state.roomReducer.comments,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setRoomInfo: (roomData) => dispatch(setRoomInfo(roomData)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TeamDetail);

function TeamDetail({ roomInfo, roomHost, comments, setRoomInfo }) {
  //초기 셋팅
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    getRoomInfo(
      router.query.id,
      (res) => {
        const roomData = {
          roomInfo: res.data.response,
          host: res.data.response.host,
          members: res.data.response.userDtos,
          comments: res.data.response.commentDtos.content,
        };
        setRoomInfo(roomData);
        console.log(res, "스터디 조회 성공");
      },
      (err) => {
        console.log(err, "스터디를 조회할 수 없습니다.");
      }
    );
  }, [router.isReady]);

  const reload = () => {
    getRoomInfo(
      router.query.id,
      (res) => {
        console.log(res, "스터디 조회 성공");
        const roomData = {
          roomInfo: res.data.response,
          host: res.data.response.host,
          members: res.data.response.userDtos,
          comments: res.data.response.commentDtos.content,
        };

        console.log(roomData);
        setRoomInfo(roomData);
      },
      (err) => {
        console.log(err, "스터디를 조회할 수 없습니다.");
      }
    );
  };

  // 스터디룸 가입 신청
  const onJoinStudy = (id) => {
    const data = {
      studyId: id,
    };
    joinTeam(
      data,
      (res) => {
        console.log(res, "가입 완료");
      },
      (err) => {
        console.log(err, "호스트는 이미 멤버로 등록되어 있습니다.");
      }
    );
  };

  //댓글 등록
  const onUploadComment = (event) => {
    event.preventDefault();
    const data = {
      studyId: router.query.id,
      obj: {
        content: event.target[0].value,
      },
    };
    createDetailComment(
      data,
      (res) => {
        console.log(res, "댓글 등록 완료");
        reload();
      },
      (err) => {
        console.log(err, "댓글 등록 실패");
      }
    );
    event.target[0].value = "";
  };

  return (
    <div>
      <h1>{roomInfo.name}</h1>
      <button onClick={() => onJoinStudy(roomInfo.id)}>가입신청</button>

      <div className={styles.info}>
        <span>호스트</span>
        <span>{roomHost.nickName}</span>

        <span>생성일</span>
        <div>
          {/* {roomInfo.createdAt
            ? `${createdAt[0]}${createdAt[1]}${createdAt[2]}${createdAt[3]}. ${createdAt[5]}${createdAt[6]}. ${createdAt[8]}${createdAt[9]}`
            : null} */}
        </div>

        <span>목표</span>
        <p>{roomInfo.goal}</p>

        <span>오카방 주소</span>
        <p>{roomInfo.openKakao}</p>

        <span>팀 소개</span>
        <p>{roomInfo.description}</p>

        <label>태그</label>
        <div>
          {roomInfo.hashTags?.map((hashTag, index) => (
            <p key={index}># {hashTag}</p>
          ))}
        </div>
      </div>

      <div className={styles.comment}>
        <h2>궁금하당</h2>
        <h3>New Comment</h3>
        <div className={styles.user}>
          <div className="icon"></div>
          <label className="author">Bori</label>
        </div>
        <form onSubmit={onUploadComment}>
          <input type="text" placeholder="comment..." />
          <button>Upload</button>
        </form>
        <div className="commentList">
          <h1>Comments</h1>
          {comments.map((comment, index) => (
            <Comment comment={comment} key={index} reload={reload} />
          ))}
        </div>
      </div>
    </div>
  );
}
