import styles from "../../../../scss/team/form.module.scss";

import { addPost } from "../../../../api/board";
import { useRouter } from "next/router";
import { useState } from "react";

export default function createPost() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const onSubmitPost = (event) => {
    event.preventDefault();
    const data = {
      studyId: router.query.id,
      req: {
        title,
        content,
      },
    };
    console.log(data);
    addPost(
      data,
      (res) => {
        console.log(res, "글 게시 성공");
        onMoveBoardPage();
      },
      (err) => {
        console.log(err, "글 게시 실패");
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

  return (
    <div className={styles.formContainer}>
      <button onClick={onMoveBoardPage} className={styles.moveBackBtn}>
        <i className="fas fa-angle-double-left"></i> 돌아가기
      </button>

      <form onSubmit={onSubmitPost}>
        <h2>게시글 작성</h2>

        <div className={styles.contents}>
          <label htmlFor="question">제목</label>
          <input
            name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            autoFocus
          />

          <label htmlFor="answer" className={styles.answerLabel}>
            내용
          </label>
          <textarea
            name="content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
          ></textarea>
        </div>
      </form>

      <button className={styles.submitBtn} onClick={onSubmitPost}>
        등록
      </button>
    </div>
  );
}
