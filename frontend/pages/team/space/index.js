import styles from "../../../scss/team/space/teamspace.module.scss";
import Layout from "../../../components/team/space/layout";

import {
  fetchRoomInfo,
  removeStudy,
  getWaitingMembers,
  allowJoinTeam,
  removeMember,
  outTeam,
} from "../../../store/actions/roomAction";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { useEffect } from "react";

const mapStateToProps = (state) => {
  return {
    roomInfo: state.roomReducer.curRoomInfo,
    roomHost: state.roomReducer.curRoomHost,
    roomMembers: state.roomReducer.curRoomMembers,
    waitingList: state.roomReducer.waitings,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getRoomInfo: (id) => {
      const data = fetchRoomInfo(id);
      data.then((res) => {
        dispatch(res);
      });
    },

    getWaitingMember: (id) => {
      const data = getWaitingMembers(id);
      data.then((res) => {
        dispatch(res);
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TeamSpace);

function TeamSpace({
  roomInfo,
  roomHost,
  roomMembers,
  waitingList,
  getRoomInfo,
  getWaitingMember,
}) {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    getRoomInfo(router.query.id);
  }, [router.isReady]);

  useEffect(() => {
    if (roomHost === "Bori") getWaitingMember(router.query.id);
  }, [roomHost]);

  //팀 삭제
  const onDeleteTeam = () => {
    removeStudy(router.query.id);
    console.log("스터디룸이 삭제되었습니다.");
    router.push("/user/mypage/myroom");
  };

  //팀 수정
  const onUpdatePage = () => {
    router.push({
      pathname: `/team/space/update`,
      query: {
        id: router.query.id,
      },
    });
  };

  //팀원관리(호스트만 해당)
  const onRemoveMember = (event) => {
    event.preventDefault();
    const data = {
      studyId: router.query.id,
      userId: event.target[0].value,
    };
    removeMember(data);
  };

  //대기자 승인
  const onAllowJoin = async (event) => {
    event.preventDefault();
    const data = {
      studyId: router.query.id,
      userId: event.target[0].value,
    };
    await allowJoinTeam(data);
    await getRoomInfo(router.query.id);
    await getWaitingMember(router.query.id);
  };

  //스터디룸 탈퇴
  const onOutTeam = () => {
    outTeam(router.query.id);
  };

  return (
    <div>
      <Layout
        name={roomInfo.name}
        host={roomHost}
        createdAt={roomInfo.createdAt}
      />
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

        <div>
          {roomHost === "Bori" ? (
            <div>
              <button onClick={onUpdatePage}>팀 수정</button>
              <button onClick={() => onDeleteTeam()}>팀 삭제</button>
              <h1>멤버관리</h1>
              {roomMembers.map((member, index) => (
                <form key={index} onSubmit={onRemoveMember}>
                  <input type="hidden" value={member.id} disabled />
                  <input
                    type="text"
                    key={index}
                    value={member.nickName}
                    disabled
                  />
                  <button>강제탈퇴</button>
                </form>
              ))}
              <h1>대기명단</h1>
              {waitingList.map((member, index) => (
                <form key={index} onSubmit={onAllowJoin}>
                  <input type="hidden" value={member.id} disabled />
                  <input type="text" value={member.nickName} disabled />
                  <button>가입승인</button>
                </form>
              ))}
            </div>
          ) : (
            <button onClick={onOutTeam}>팀 탈퇴</button>
          )}
        </div>
      </div>
    </div>
  );
}
