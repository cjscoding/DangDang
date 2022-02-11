import styles from "../../../scss/team/space/layout.module.scss";
import Link from "next/link";
import { FRONTEND_URL, BACKEND_URL } from "../../../config";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

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
    window.open(`${FRONTEND_URL}/web-conference/check-devices/${studyId}`);
  }
  return (
    <div className={styles.teamSpaceLayout}>
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
          <span>마지막 연습</span>
          <span>
            {roomInfo.lastAccessTime?.slice(0, 10)}{" "}
            {roomInfo.lastAccessTime?.slice(11, 19)}
          </span>
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
          <button className={styles.kakaoBtn}>
            <a href={href}>{btnText}</a>
          </button>
        ) : (
          <button className={styles.registBtn}>
            <Link
              href={{
                pathname: `${href}`,
                query: {
                  id: studyId,
                },
              }}
            >
              <a>{btnText}</a>
            </Link>
          </button>
        )}
      </div>
    </div>
  );
}

//
