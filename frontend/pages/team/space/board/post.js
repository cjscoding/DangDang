import Link from "next/link";

import { updatePost, deletePost } from "../../../../api/board";
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
  const [updateMode, setUpdateMode] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    const post = JSON.parse(router.query.post);
    setPost(post.post);
  }, [router.isReady]);

  //input values
  const onChangeValue = (event) => {
    const { name, value } = event.target;

    const newPost = {
      ...post,
      [name]: value,
    };

    setPost(newPost);
  };

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
    console.log(data);
    updatePost(
      data,
      (res) => {
        console.log(res, "글 수정 성공");
        setUpdateMode(!updateMode);
      },
      (err) => {
        console.log(err, "글 수정 실패");
      }
    );
  };

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
          },
        });
      },
      (err) => {
        console.log(err, "글 삭제 실패");
      }
    );
  };

  return (
    <div>
      <Link
        href={{
          pathname: "/team/space/board",
          query: {
            id: router.query.id,
          },
        }}
      >
        <a>목록으로</a>
      </Link>
      {updateMode ? (
        <form onSubmit={onUpdatePost}>
          <label htmlFor="title">제목</label>
          <input
            type="text"
            name="title"
            value={post.title}
            onChange={onChangeValue}
          />
          <label htmlFor="content">내용</label>
          <input
            type="text"
            name="content"
            value={post.content}
            onChange={onChangeValue}
          />
          <div className="btns">
            <button>수정완료</button>
            <button onClick={() => setUpdateMode(!updateMode)}>취소</button>
          </div>
        </form>
      ) : (
        <div>
          <span>제목</span>
          <p>{post.title}</p>
          <span>내용</span>
          <p>{post.content}</p>
          <span>생성일</span>
          <p>{post.createdAt.slice(0, 10)}</p>
          <span>작성자</span>
          <p>{post.writer.nickName}</p>
          <div className="btns">
            <button onClick={() => setUpdateMode(!updateMode)}>수정</button>
            <button onClick={onDeletePost}>삭제</button>
          </div>
        </div>
      )}
    </div>
  );
}
