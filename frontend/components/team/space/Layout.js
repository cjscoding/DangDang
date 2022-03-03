import styles from "../../../scss/team/space/layout.module.scss";
import Link from "next/link";
import { FRONTEND_URL, BACKEND_URL } from "../../../config";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import getStreamPermission from "../../webRTC/getStreamPermission";
import Title from "../../layout/Title";

export default function Layout({ roomInfo, host, image, href, btnText }) {
  const router = useRouter();
  const [studyId, setStudyId] = useState("");
  const [curPage, setCurPage] = useState("info");

  useEffect(() => {
    if (!router.isReady) return;
    setStudyId(router.query.id);
    setCurPage(router.query.page);
  }, [router.isReady]);

  function goToWebConference() {
    getStreamPermission(`/web-conference/check-devices/${studyId}`);
  }

  const onMoveKakaoPage = () => {
    window.open(href);
  };

  return (
    <div className={styles.teamSpaceLayout}>
      <Title title={`${roomInfo.name}`}></Title>
      <div className={styles.teamInfoBox}>
        <div className={styles.mainInfo}>
          <div className={styles.image}>
            {image !== null && image !== "default.jpg" ? (
              <img src={`${BACKEND_URL}/files/images/${image}`} />
            ) : (
              <img src="/images/dangdang_1.png" />
            )}
          </div>

          <div className={styles.title}>
            <h2>{roomInfo.name}</h2>
            <h4>{roomInfo.goal}</h4>
            <div className={styles.hashTags}>
              {roomInfo.hashTags?.map((tag) => (
                <span key={tag}>#{tag}</span>
              ))}
            </div>
            <button onClick={goToWebConference}>연습 시작하기</button>
          </div>
        </div>

        <div className={styles.detailInfo}>
          <span>개설일</span>
          <span>{roomInfo.createdAt?.slice(0, 10)}</span>
          <span>인원</span>
          <span>{roomInfo.number}명</span>
          <span>스터디장</span>
          <span>{host}</span>
        </div>
      </div>

      <div className={styles.teamSpaceMenuBar}>
        <div className={styles.menuBar}>
          <Link
            href={{
              pathname: "/team/space",
              query: {
                id: studyId,
                page: "info",
              },
            }}
          >
            <a className={`${curPage}` === "info" ? styles.infoMenu : ""}>
              팀 소개
            </a>
          </Link>
          <Link
            href={{
              pathname: "/team/space/resume",
              query: {
                id: studyId,
                page: "resume",
              },
            }}
          >
            <a className={`${curPage}` === "resume" ? styles.resumeMenu : ""}>
              자기소개서
            </a>
          </Link>

          <Link
            href={{
              pathname: "/team/space/board",
              query: {
                id: studyId,
                page: "board",
              },
            }}
          >
            <a className={`${curPage}` === "board" ? styles.boardMenu : ""}>
              보드
            </a>
          </Link>
        </div>

        {`${curPage}` === "info" ? (
          <button className={styles.kakaoBtn} onClick={onMoveKakaoPage}>
            <a>{btnText}</a>
          </button>
        ) : (
          <Link
            href={{
              pathname: `${href}`,
              query: {
                id: studyId,
              },
            }}
          >
            <a className={styles.registBtn}>{btnText}</a>
          </Link>
        )}
      </div>
    </div>
  );
}

//
