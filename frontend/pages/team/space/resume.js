import styles from "../../../scss/team/space/teamspace.module.scss";
import Layout from "../../../components/team/space/layout";

import { fetchRoomInfo } from "../../../store/actions/roomAction";
import { getResume } from "../../../store/actions/resumeAction";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";

const mapStateToProps = (state) => {
  return {
    roomInfo: state.roomReducer.curRoomInfo,
    roomHost: state.roomReducer.curRoomHost,
    roomMembers: state.roomReducer.curRoomMembers,
    curResume: state.resumeReducer.curMemberResume,
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
    getCurMemberResume: (userId) => {
      const data = getResume(userId);
      data.then((res) => {
        dispatch(res);
        console.log(res);
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Resume);

function Resume({
  roomInfo,
  roomHost,
  roomMembers,
  curResume,
  getRoomInfo,
  getCurMemberResume,
}) {
  const router = useRouter();
  const [resumeLen, setResumeLen] = useState(0);

  useEffect(() => {
    if (!router.isReady) return;
    getRoomInfo(router.query.id);
  }, [router.isReady]);

  useEffect(() => {
    setResumeLen(curResume.length);
  }, [curResume]);

  //해당 멤버의 자소서 조회
  const onShowResume = async (userId) => {
    await getCurMemberResume(userId);
  };

  return (
    <div>
      <Layout
        name={roomInfo.name}
        host={roomHost}
        createdAt={roomInfo.createdAt}
      />
      <h1>자기소개서</h1>
      <div className={styles.coverletter}>
        <div className={styles.member}>
          {roomMembers?.map((member, index) => (
            <button key={index} onClick={() => onShowResume(member.id)}>
              {member.nickName}
            </button>
          ))}
        </div>
        <div className="list">
          {resumeLen > 0 ? (
            <div>
              {curResume?.map((resume, index) => (
                <div key={index}>
                  <div>{resume.question}</div>
                  <div>{resume.answer}</div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <h1>아직 등록된 자소서가 없어요 ㅠㅠ</h1>
              <button>등록하기</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
