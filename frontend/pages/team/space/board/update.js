import styles from "../../../../scss/team/form.module.scss";

import { updatePost } from "../../../../api/board";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function ResumeUpdate() {
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

  //update post
  const onUpdatePost = (event) => {
    event.preventDefault();

    const data = {
      studyId: router.query.id,
      postId: post.id,
      req: {
        title: post.title,
        content: post.content,
      },
    };

    updatePost(
      data,
      (res) => {
        console.log(res, "글 수정 성공");
        onMoveViewPage();
      },
      (err) => {
        console.log(err, "글 수정 실패");
      }
    );
  };

  //input values
  const onChangeValue = (event) => {
    const { name, value } = event.target;

    const newPost = {
      ...post,
      [name]: value,
    };

    setPost(newPost);
  };

  //게시글 상세보기 페이지로 돌아가기
  const onMoveViewPage = () => {
    router.push({
      pathname: "/team/space/board/post",
      query: {
        id: router.query.id,
        post: JSON.stringify({ post }),
      },
    });
  };

  return (
    <div className={styles.formContainer}>
      <button onClick={onMoveViewPage} className={styles.moveBackBtn}>
        <i className="fas fa-angle-double-left"></i> 돌아가기
      </button>

      <form>
        <label htmlFor="title">제목</label>
        <input
          type="text"
          name="title"
          value={post.title}
          onChange={onChangeValue}
        />
        <label htmlFor="content">내용</label>
        <textarea
          type="text"
          name="content"
          value={post.content}
          onChange={onChangeValue}
        />
      </form>

      <button className={styles.submitBtn} onClick={onUpdatePost}>
        수정
      </button>
    </div>
  );
}
