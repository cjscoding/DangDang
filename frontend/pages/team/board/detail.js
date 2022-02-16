import styles from "../../../scss/team/board/detail.module.scss";
import Comment from "../../../components/team/board/Comment";

import { setRoomInfo } from "../../../store/actions/roomAction";
import { getRoomInfo } from "../../../api/studyroom";
import { joinTeam, checkJoin } from "../../../api/member";
import { createDetailComment } from "../../../api/comment";
import { BACKEND_URL } from "../../../config";

import { useRouter } from "next/router";
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import Link from "next/link";

const mapStateToProps = (state) => {
  return {
    roomInfo: state.roomReducer.curRoomInfo,
    roomHost: state.roomReducer.curRoomHost,
    comments: state.roomReducer.comments,
    user: state.userReducer.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setRoomInfo: (roomData) => dispatch(setRoomInfo(roomData)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TeamDetail);

function TeamDetail({ user, roomInfo, roomHost, comments, setRoomInfo }) {
  const router = useRouter();
  const [join, setJoin] = useState(false);

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

    checkJoin(
      router.query.id,
      (res) => {
        console.log(res, "가입여부조회");
        setJoin(res.data.response ? true : false);
      },
      (err) => {
        console.log(err);
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
      userId: user.id,
    };

    if (join) {
      joinTeam(
        data,
        (res) => {
          console.log(res);
          alert("가입 신청이 취소되었습니다.");
          setJoin(false);
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      joinTeam(
        data,
        (res) => {
          console.log(res);
          alert("가입 신청 완료되었습니다.");
          setJoin(true);
        },
        (err) => {
          console.log(err);
        }
      );
    }
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

  const onMoveKakaoPage = (href) => window.open(href);

  return (
    <div className={styles.container}>
      <div className={styles.mainContainer}>
        <div className={styles.infoBox}>
          <div className={styles.mainInfo}>
            <div className={styles.image}>
              {roomInfo.imageUrl !== null &&
              roomInfo.imageUrl !== "default.jpg" ? (
                <img src={`${BACKEND_URL}/files/images/${roomInfo.imageUrl}`} />
              ) : (
                <img src="/images/dangdang_1.png" />
              )}
            </div>

            <div className={styles.title}>
              <h2>{roomInfo.name}</h2>
              <div className={styles.hashTags}>
                {roomInfo.hashTags?.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </div>
              <h4>
                <i className="fas fa-user-friends"></i> {roomHost.nickName} 외{" "}
                {roomInfo.number - 1}명
              </h4>
            </div>
          </div>

          <div className={styles.btns}>
            {join ? (
              <button
                onClick={() => onJoinStudy(roomInfo.id)}
                className={styles.cancelBtn}
              >
                가입취소
              </button>
            ) : (
              <button
                onClick={() => onJoinStudy(roomInfo.id)}
                className={styles.registBtn}
              >
                가입신청
              </button>
            )}

            <button
              className={styles.kakaoBtn}
              onClick={() => onMoveKakaoPage(roomInfo.openKakao)}
            >
              <a>오픈카톡</a>
            </button>
          </div>
        </div>

        <div className={styles.introduction}>
          <span>{roomInfo.goal}</span>
          <p>{roomInfo.description}</p>
        </div>

        <h2 className={styles.commentTitle}>물어보면 답해준당</h2>

        <div className={styles.commentBox}>
          <form onSubmit={onUploadComment}>
            <input type="text" placeholder="댓글을 남겨주세요..." />
            <button>등록</button>
          </form>
          {comments.map((comment, index) => (
            <Comment
              comment={comment}
              key={index}
              reload={reload}
              userImage={comment.writerImageUrl}
            />
          ))}
        </div>
      </div>

      <div className={styles.backBtnBox}>
        <Link href="/team/board">
          <a className={styles.registBtn}>목록으로</a>
        </Link>
      </div>
    </div>
  );
}
