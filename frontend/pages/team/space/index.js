import styles from "../../../scss/team/space/teamspace.module.scss";
import Layout from "../../../components/team/space/layout";

import { setRoomInfo, setWaitings } from "../../../store/actions/roomAction";
import { getRoomInfo, removeRoom } from "../../../api/studyroom";
import {
  removeMember,
  leaveTeam,
  getWaitings,
  allowMember,
} from "../../../api/member";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { useEffect } from "react";

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

  //for everyone
  //스터디 단일 조회
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
  }, [router.isReady]);

  //for host
  //팀원강제탈퇴
  const onRemoveMember = (event) => {
    event.preventDefault();
    const data = {
      studyId: router.query.id,
      userId: event.target[0].value,
    };

    if (data.userId === roomHost.id) {
      console.log("호스트는 탈퇴시킬 수 없습니다.");
    } else {
      removeMember(
        data,
        (res) => {
          console.log(res, "팀원 강제 탈퇴 완료!");
          getRoomInfo(
            router.query.id,
            (res) => {
              const roomData = {
                roomInfo: res.data.response,
                host: res.data.response.host.nickName,
                members: res.data.response.userDtos,
                comments: res.data.response.commentDtos.content,
              };
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
        getRoomInfo(
          router.query.id,
          (res) => {
            const roomData = {
              roomInfo: res.data.response,
              host: res.data.response.host.nickName,
              members: res.data.response.userDtos,
              comments: res.data.response.commentDtos.content,
            };
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
    <div>
      <Layout
        name={roomInfo.name}
        host={roomHost.nickName}
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
          {roomHost && roomHost.id === userInfo.id? (
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
              {waitingList?.map((member, index) => (
                <form key={index} onSubmit={onAllowJoin}>
                  <input type="hidden" value={member.id} disabled />
                  <input type="text" value={member.nickName} disabled />
                  <button>가입승인</button>
                </form>
              ))}
            </div>
          ) : (
            <button onClick={onLeaveTeam}>팀 탈퇴</button>
          )}
        </div>
      </div>
    </div>
  );
}
