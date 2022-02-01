import styles from "../../../scss/team/space/teamspace.module.scss";
import Layout from "../../../components/team/space/layout";

import { fetchRoomInfo } from "../../../store/actions/roomAction";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function mapStateToProps(state) {
  return {
    roomInfo: state.roomReducer.curRoomInfo,
    roomHost: state.roomReducer.curRoomHost,
    roomMembers: state.roomReducer.curRoomMembers,
  };
}

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

export default connect(mapStateToProps, mapDispatchToProps)(TeamSpace);

function TeamSpace({ roomInfo, roomHost, roomMembers, getRoomInfo }) {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    getRoomInfo(router.query.id);
  }, [router.isReady]);

  return (
    <div>
      <Layout name={roomInfo.name} host={roomHost} createdAt={roomInfo.createdAt}/>
      <div className={styles.container}>
        <div className={styles.info}>
          <h1>팀상세정보</h1>
          <br />
          <span>목표</span>
          <span>{roomInfo.goal}</span>
          <span>오픈카카오</span>
          <span>{roomInfo.openKakao}</span>
          <span>설명</span>
          <span>{roomInfo.description}</span>
          <span>팀원</span>
          <div>
            {roomMembers.map((member, index) => (
              <span key={index}>{member.nickName}</span>
            ))}
          </div>
        </div>

        <button>팀 수정</button>
        <button>팀 삭제</button>

        <div className={styles.waiting}>
          <h1>대기명단</h1>
          <div>
          </div>
        </div>
      </div>
    </div>
  );
}
