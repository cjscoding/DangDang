import styles from "../../../../scss/team/form.module.scss";

import { deletePost } from "../../../../api/board";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Post() {
  const router = useRouter();
  const initData = {
    title: "",
    content: "",
    createdAt: "",
    writer: {
      nickName: "",
    },
  };
  const [post, setPost] = useState(initData);

  useEffect(() => {
    if (!router.isReady) return;
    const post = JSON.parse(router.query.post);
    setPost(post.post);
  }, [router.isReady]);

  //delete post
  const onDeletePost = () => {
    const data = {
      studyId: router.query.id,
      postId: post.id,
    };
    deletePost(
      data,
      (res) => {
        console.log(res, "글 삭제 성공");
        router.push({
          pathname: "/team/space/board",
          query: {
            id: router.query.id,
            page: "board",
          },
        });
      },
      (err) => {
        console.log(err, "글 삭제 실패");
      }
    );
  };

  //게시판 페이지로 돌아가기
  const onMoveBoardPage = () => {
    router.push({
      pathname: "/team/space/board",
      query: {
        id: router.query.id,
        page: "board",
      },
    });
  };

  //게시판 수정 페이지로 이동
  const onMoveUpdatePage = () => {
    router.push(
      {
        pathname: "/team/space/board/update",
        query: {
          id: router.query.id,
          post: JSON.stringify({ post }),
        },
      },
      "/team/space/board/update"
    );
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.viewContainer}>
        <div className={styles.btnBox}>
          <button onClick={onMoveUpdatePage}>
            <i className="fas fa-pen"></i>
          </button>
          <button onClick={onDeletePost}>
            <i className="fas fa-trash"></i>
          </button>
        </div>

        <h2>{post.title}</h2>

        <span>
          작성자 {post.writer.nickName} | {post.createdAt.slice(0, 10)} 등록
        </span>

        <p>{post.content}</p>
      </div>

      <button className={styles.submitBtn} onClick={onMoveBoardPage}>
        목록으로
      </button>
    </div>
  );
}
