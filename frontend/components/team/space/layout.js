import Link from "next/link";
import styles from "../../../scss/team/space/layout.module.scss";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function layout() {
  const router = useRouter();
  const [studyId, setStudyId] = useState("");

  useEffect(() => {
    if (!router.isReady) return;
    setStudyId(router.query.id);
    console.log(router.query);
  }, [router.isReady]);

  return (
    <div>
      <div className={styles.preview}>
        <div className={styles.image}>이미지</div>
        <div className={styles.details}>
          <span>팀명</span>
          <span>팀설명</span>
          <span>팀목표</span>
          <span>호스트</span>
          <span>팀원</span>
        </div>
        <div className={styles.etc}>
          <span>개설일</span>
          <button>스터디 시작</button>
        </div>
      </div>
      <div className={styles.menus}>
        <Link
          href={{
            pathname: `/team/space`,
            query: {
              id: studyId,
            },
          }}
        //   as={`/team/space`}
        >
          <a>팀 소개 | </a>
        </Link>
        <Link
          href={{
            pathname: `/team/space/coverletter`,
            query: {
              id: studyId,
            },
          }}
        //   as={`/team/space/coverletter`}
        >
          <a>자소서 | </a>
        </Link>
        <Link
          href={{
            pathname: `/team/space/board`,
            query: {
              id: studyId,
            },
          }}
        //   as={`/team/space/board`}
        >
          <a>게시판</a>
        </Link>
      </div>
    </div>
  );
}
