import styles from "../../../scss/team-board/team-detail.module.scss";
import Comment from "../../../components/team-board/comment";

import { fetchRoomInfo } from "../../../store/actions/roomAction";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function mapStateToProps(state) {
  return {
    roomInfo: state.roomReducer.curRoomInfo,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getRoomInfo: (id) => {
      const data = fetchRoomInfo(id);
      data.then((res) => {
        console.log(res);
        dispatch(res);
      });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamDetail);

function TeamDetail({ roomInfo, getRoomInfo }) {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    getRoomInfo(router.query.id);
  }, [router.isReady]);

  return (
    <div>
      <h1>{roomInfo.name}</h1>

      <button>가입신청</button>

      <div className={styles.info}>
        <span>호스트</span>
        <span>{roomInfo.userDto ? roomInfo.userDto.nickName : null}</span>

        <span>생성일</span>
        <div>
          {roomInfo.createdAt?.slice(0, 3).map((date, index) => (
            <span key={index}>{date}. </span>
          ))}
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
          <label className="author">me</label>
        </div>
        <form>
          <input type="text" placeholder="comment..." />
          <button type="submit">Upload</button>
        </form>
        <div className="commentList">
          <Comment />
        </div>
      </div>
    </div>
  );
}
