import styles from "../../../scss/team/space/layout.module.scss";
import Link from "next/link";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Layout({ name, host, createdAt, image }) {
  const router = useRouter();
  const [studyId, setStudyId] = useState("");

  useEffect(() => {
    if (!router.isReady) return;
    setStudyId(router.query.id);
  }, [router.isReady]);

  return (
    <div>
      <div className={styles.preview}>
        {image !== null ? (
          <img
            src={`https://localhost:8443/files/images/${image}`}
            width="200"
            height="100"
            alt=""
          />
        ) : (
          <Image src="/vercel.svg" alt="Vercel Logo" width={300} height={250} />
        )}
        <div className={styles.details}>
          <span>팀명 : {name}</span>
          <span>호스트 : {host}</span>
        </div>
        <div className={styles.etc}>
          <span>
            개설일 :{" "}
            {createdAt
              ? `${createdAt[0]}${createdAt[1]}${createdAt[2]}${createdAt[3]}. ${createdAt[5]}${createdAt[6]}. ${createdAt[8]}${createdAt[9]}`
              : null}
          </span>
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
            pathname: `/team/space/resume`,
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
