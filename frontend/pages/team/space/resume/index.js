import styles from "../../../../scss/team/space/teamspace.module.scss";
import Layout from "../../../../components/team/space/layout";
import ResumeList from "../../../../components/team/space/resumeList";

import { setRoomInfo } from "../../../../store/actions/roomAction";
import { setResume } from "../../../../store/actions/resumeAction";
import { getRoomInfo } from "../../../../api/studyroom";
import { getResume } from "../../../../api/resume";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";

const mapStateToProps = (state) => {
  return {
    roomInfo: state.roomReducer.curRoomInfo,
    roomHost: state.roomReducer.curRoomHost,
    roomMembers: state.roomReducer.curRoomMembers,
    curResume: state.resumeReducer.curMemberResume,
    userInfo: state.userReducer.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setRoomInfo: (roomData) => dispatch(setRoomInfo(roomData)),
    setResume: (userId) => dispatch(setResume(userId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Resume);

function Resume({
  roomInfo,
  roomHost,
  roomMembers,
  curResume,
  userInfo,
  setRoomInfo,
  setResume,
}) {
  const router = useRouter();
  const [selected, setSelected] = useState(false);
  const [resumeLen, setResumeLen] = useState(0);
  const [curUserId, setCurUserId] = useState("");

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

  //해당 멤버의 자소서 조회
  const onShowResume = (userId) => {
    setCurUserId(userId);
    getResume(
      userId,
      (res) => {
        const resArray = res.data.response;
        setResume(resArray);
        setResumeLen(resArray.length);
        setSelected(true);
        console.log(res, "자소서 불러오기 성공");
      },
      (err) => {
        console.log(err, "자소서 불러오기 실패");
      }
    );
  };

  const getCurUserResume = () => {
    getResume(
      curUserId,
      (res) => {
        const resArray = res.data.response;
        setResume(resArray);
        setResumeLen(resArray.length);
        setSelected(true);
        console.log(res, "자소서 불러오기 성공");
      },
      (err) => {
        console.log(err, "자소서 불러오기 실패");
      }
    );
  };

  //자소서 재로드
  const reload = () => getCurUserResume();

  //자소서 등록 페이지로 이동
  const onMoveToAddResume = () => {
    router.push({
      pathname: "/team/space/resume/create",
      query: {
        id: router.query.id,
      },
    });
  };
  return (
    <div>
      <Layout
        name={roomInfo.name}
        host={roomHost.nickName}
        createdAt={roomInfo.createdAt}
        image={roomInfo.imageUrl}
      />
      <h1>자기소개서</h1>
      <div className={styles.coverletter}>
        <div className={styles.member}>
          {roomMembers?.map((member, index) => (
            <button key={index} onClick={() => onShowResume(member.id)}>
              {member.nickName}
            </button>
          ))}
          <button onClick={onMoveToAddResume}>자소서 등록</button>
        </div>
        <div>
          {selected ? (
            <div className="list">
              {resumeLen > 0 ? (
                <div>
                  {curResume?.map((resume, index) => (
                    <ResumeList
                      resume={resume}
                      comments={resume.commentDtos.content}
                      key={index}
                      index={index}
                      reload={reload}
                    />
                  ))}
                </div>
              ) : (
                <div>
                  <h1>아직 등록된 자소서가 없어요 ㅠㅠ</h1>
                </div>
              )}
            </div>
          ) : (
            <div className="list">
              <p>조회하실 팀원을 선택해주세요!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
