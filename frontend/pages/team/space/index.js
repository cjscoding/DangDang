import styles from "../../../scss/team/space/teamspace.module.scss";
import Layout from "../../../components/team/space/Layout";

import {
  removeMember,
  leaveTeam,
  getWaitings,
  allowMember,
} from "../../../api/member";
import { setRoomInfo, setWaitings } from "../../../store/actions/roomAction";
import { getRoomInfo, removeRoom } from "../../../api/studyroom";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const mapStateToProps = (state) => {
  return {
    roomInfo: state.roomReducer.curRoomInfo,
    roomHost: state.roomReducer.curRoomHost,
    roomMembers: state.roomReducer.curRoomMembers,
    waitingList: state.roomReducer.waitings,
    userInfo: state.userReducer.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setRoomInfo: (roomData) => dispatch(setRoomInfo(roomData)),
    setWaitings: (waitings) => dispatch(setWaitings(waitings)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TeamSpace);

function TeamSpace({
  roomInfo,
  roomHost,
  roomMembers,
  waitingList,
  userInfo,
  setRoomInfo,
  setWaitings,
}) {
  const router = useRouter();
  const [hostId, setHostId] = useState("");
  const [userId, setUserId] = useState("");

  const reload = () => {
    getRoomInfo(
      router.query.id,
      (res) => {
        const roomData = {
          roomInfo: res.data.response,
          host: res.data.response.host,
          members: res.data.response.userDtos,
          comments: res.data.response.commentDtos.content,
        };
        console.log(roomData);
        setRoomInfo(roomData);
        getWaitings(
          router.query.id,
          (res) => {
            const waitings = res.data.response;
            setWaitings(waitings);
            console.log(res, "가입대기명단 조회 성공!");
          },
          (err) => {
            console.log(err, "가입대기명단 조회에 실패하였습니다.");
          }
        );
      },
      (err) => {
        console.log(err, "스터디를 조회할 수 없습니다.");
      }
    );
  };

  //for everyone
  //스터디 단일 조회
  useEffect(() => {
    if (!router.isReady) return;
    reload();
  }, [router.isReady]);

  //host 정보
  useEffect(() => {
    setHostId(roomHost.id);
  }, [roomHost]);

  //user 정보
  useEffect(() => {
    setUserId(userInfo.id);
  }, [userInfo]);

  //for host
  //팀원강제탈퇴
  const onRemoveMember = (event) => {
    event.preventDefault();

    const data = {
      studyId: router.query.id,
      userId: event.target[0].value,
    };

    if (event.target[0].value == hostId) {
      console.log("호스트는 탈퇴시킬 수 없습니다.");
    } else {
      removeMember(
        data,
        (res) => {
          console.log(res, "팀원 강제 탈퇴 완료!");
          reload();
        },
        (err) => {
          console.log(err, "팀원을 탈퇴시킬 수 없습니다.");
        }
      );
    }
  };

  //대기자 승인
  const onAllowJoin = (event) => {
    event.preventDefault();
    const data = {
      studyId: router.query.id,
      userId: event.target[0].value,
    };
    allowMember(
      data,
      (res) => {
        console.log(res, "가입승인 성공");
        reload();
      },
      (err) => {
        console.log(err, "가입승인 실패");
      }
    );
  };

  //팀 수정페이지로 이동
  const onUpdatePage = () => {
    router.push({
      pathname: `/team/space/update`,
      query: {
        id: router.query.id,
      },
    });
  };

  //팀 삭제
  const onDeleteTeam = () => {
    removeRoom(
      router.query.id,
      (res) => {
        console.log(res, "스터디 삭제 완료!");
      },
      (err) => {
        console.log(err, "스터디를 삭제할 권한이 없습니다.");
      }
    );
    router.push("/user/mypage/myroom");
  };

  //for member
  //스터디룸 탈퇴
  const onLeaveTeam = () => {
    // if (userInfo.id !== "") {
    leaveTeam(
      router.query.id,
      (res) => {
        console.log(res, "팀 탈퇴 완료!");
        router.push("/user/mypage/myroom");
      },
      (err) => {
        console.log(err, "팀을 탈퇴할 수 없습니다.");
      }
    );
    // }
  };

  return (
    <div className={styles.teamSpace}>
      <Layout
        roomInfo={roomInfo}
        host={roomHost.nickName}
        createdAt={roomInfo.createdAt}
        image={roomInfo.imageUrl}
      />

      <button className={styles.kakaoBtn}>
        <a href={roomInfo.openKakao}>오픈카톡</a>
      </button>

      <div className={styles.contentBox}>
        <button onClick={onUpdatePage}>
          <i class="fas fa-pencil-alt"></i>
        </button>
        <p>{roomInfo.description}</p>
      </div>

      {userId === hostId ? (
        <div className={styles.adminContainer}>
          <div className={styles.adminBox}>
            <div className={styles.section}>
              <h3>멤버관리</h3>
              <div className={styles.memberList}>
                {roomMembers.map((member, index) => (
                  <form key={index} onSubmit={onRemoveMember}>
                    <div>
                      <img src="/vercel.svg" alt="" />
                      <input type="hidden" value={member.id} disabled />
                      <input
                        type="text"
                        key={index}
                        value={member.nickName}
                        disabled
                      />
                    </div>
                    {member.id !== hostId ? (
                      <button className={styles.removeMemberBtn}>
                        강제탈퇴
                      </button>
                    ) : (
                      <></>
                    )}
                  </form>
                ))}
              </div>
            </div>

            <div className={styles.section}>
              <h3>대기명단</h3>
              <div className={styles.waitingList}>
                {waitingList?.map((member, index) => (
                  <form key={index} onSubmit={onAllowJoin}>
                    <div>
                      <img src="/vercel.svg" alt="" />
                      <input type="hidden" value={member.id} disabled />
                      <input type="text" value={member.nickName} disabled />
                    </div>
                    <button className={styles.allowMemberBtn}>가입승인</button>
                  </form>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.deleteBtnBox}>
            <button onClick={() => onDeleteTeam()}>팀 삭제</button>
          </div>
        </div>
      ) : (
        <div className={styles.deleteBtnBox}>
          <button onClick={onLeaveTeam}>팀 탈퇴</button>
        </div>
      )}
    </div>
  );
}
