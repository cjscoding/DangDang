import styles from "../../../scss/team/space/teamspace.module.scss";
import Layout from "../../../components/team/space/layout";

import { fetchRoomInfo, removeStudy, getWaitingMembers } from "../../../store/actions/roomAction";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { useEffect } from "react";

const mapStateToProps = (state) => {
  return {
    roomInfo: state.roomReducer.curRoomInfo,
    roomHost: state.roomReducer.curRoomHost,
    roomMembers: state.roomReducer.curRoomMembers,
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
    deleteStudy: (id) => {
      removeStudy(id);
    },
    getWaitingMember: (id) => {
        const data = getWaitingMembers(id);
        // data.then((res) => {
        //     dispatch(res);
        // })
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TeamSpace);

function TeamSpace({
  roomInfo,
  roomHost,
  roomMembers,
  getRoomInfo,
  deleteStudy,
  getWaitingMember
}) {
  const router = useRouter();

  useEffect(() => {
    console.log(roomMembers);
    if (!router.isReady) return;
    getRoomInfo(router.query.id);
    getWaitingMember(router.query.id);
  }, [router.isReady]);

  //팀 삭제
  const onDeleteTeam = () => {
    deleteStudy(router.query.id);
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
  const onRemoveMember = () => {
      //not yet
  }

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

        <button onClick={onUpdatePage}>팀 수정</button>
        <button onClick={() => onDeleteTeam()}>팀 삭제</button>

        <div>
          {roomHost === "Bori" ? (
            <div>
              <h1>멤버관리</h1>
              {roomMembers.map((member, index) => (
                <form key={index} onSubmit={onRemoveMember}>
                  <input key={index} value={member.nickName} disabled/>
                  <button>강제탈퇴</button>
                </form>
              ))}
            </div>
          ) : null}
        </div>

        <div className={styles.waiting}>
          <h1>대기명단</h1>
          <div></div>
        </div>
      </div>
    </div>
  );
}
