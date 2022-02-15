import styles from "../../../../scss/team/space/resume.module.scss";
import Layout from "../../../../components/team/space/Layout";
import ResumeList from "../../../../components/team/space/ResumeList";

import { setRoomInfo } from "../../../../store/actions/roomAction";
import { setResume } from "../../../../store/actions/resumeAction";
import { getRoomInfo } from "../../../../api/studyroom";
import { getResume } from "../../../../api/resume";
import { BACKEND_URL } from "../../../../config";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";

const mapStateToProps = (state) => {
  return {
    roomInfo: state.roomReducer.curRoomInfo,
    roomHost: state.roomReducer.curRoomHost,
    roomMembers: state.roomReducer.curRoomMembers,
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
  userInfo,
  roomInfo,
  roomHost,
  roomMembers,
  setRoomInfo,
  setResume,
}) {
  const router = useRouter();
  const [curUserId, setCurUserId] = useState(userInfo.id);
  const [resumeList, setResumeList] = useState([]);

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
        console.log(res, "스터디 조회 성공");
      },
      (err) => {
        console.log(err, "스터디를 조회할 수 없습니다.");
      }
    );
  }, [router.isReady]);

  useEffect(() => {
    setCurUserId(userInfo.id);
  }, [userInfo]);

  //해당 멤버의 자소서 조회
  const onSetCurUser = (userId) => setCurUserId(userId);

  const getCurUserResume = () => {
    getResume(
      curUserId,
      (res) => {
        const resArray = res.data.response;
        setResumeList(resArray);
        setResume(resArray);
        console.log(res, "자소서 불러오기 성공");
      },
      (err) => {
        console.log(err, "자소서 불러오기 실패");
      }
    );
  };

  useEffect(() => {
    getCurUserResume();
  }, [curUserId]);

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
    <div className={styles.teamResume}>
      <Layout
        roomInfo={roomInfo}
        host={roomHost.nickName}
        createdAt={roomInfo.createdAt}
        image={roomInfo.imageUrl}
        href={"/team/space/resume/create"}
        btnText="자기소개서 등록하기"
      />

      <div className={styles.resumeContainer}>
        <div className={styles.memberListBox}>
          <h4>팀원 목록이당</h4>
          {roomMembers?.map((member) => {
            const imgUrl = member.imageUrl.slice(0, 4) === "http"?member.imageUrl:`${BACKEND_URL}/files/images/${member.imageUrl}`
            return(
            <div key={member.id} className={styles.member}>
              <div className={styles.imgBox}>
                {member.imageUrl !== null &&
                member.imageUrl !== "default.jpg" ? (
                  <img src={imgUrl} />
                ) : (
                  <img src="/images/dangdang_1.png" />
                )}
              </div>
              {member.id === curUserId ? (
                <button
                  onClick={() => onSetCurUser(member.id)}
                  className={styles.currentMember}
                >
                  {member.nickName}
                </button>
              ) : (
                <button onClick={() => onSetCurUser(member.id)}>
                  {member.nickName}
                </button>
              )}
            </div>
          )})}
        </div>

        <div className={styles.contents}>
          {resumeList.length > 0 ? (
            <div>
              {resumeList?.map((resume, index) => (
                <ResumeList
                  resume={resume}
                  comments={resume.commentDtos.content}
                  key={resume.id}
                  index={index}
                  reload={reload}
                />
              ))}
            </div>
          ) : (
            <div className={styles.contentList}>
              <h2>아직 등록된 자소서가 없어요 ㅜ.ㅜ</h2>
              <span>자기소개서를 등록하고</span>
              <span>팀원들의 피드백을 받아보세요!</span>
              <div>
                <button
                  onClick={onMoveToAddResume}
                  className={styles.registBtn}
                >
                  자기소개서 등록하기
                </button>
              </div>
              <div className={styles.imgBox}>
                <img src="/images/dangdang_1.png" width={100} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
