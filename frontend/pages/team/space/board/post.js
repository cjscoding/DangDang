import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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

  return (
    <div>
      <span>제목</span>
      <p>{post.title}</p>
      <span>내용</span>
      <p>{post.content}</p>
      <span>생성일</span>
      <p>{post.createdAt.slice(0, 10)}</p>
      <span>작성자</span>
      <p>{post.writer.nickName}</p>
    </div>
  );
}
