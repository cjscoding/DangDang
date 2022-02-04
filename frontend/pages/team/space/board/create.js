import { useRouter } from "next/router";
import Link from "next/link";
import { addPost } from "../../../../api/board";

export default function createPost() {
  const router = useRouter();

  const onSubmitPost = (event) => {
    event.preventDefault();
    const data = {
      studyId: router.query.id,
      req: {
        title: event.target[0].value,
        content: event.target[1].value,
      },
    };
    console.log(data);
    addPost(
      data,
      (res) => {
        console.log(res, "글 게시 성공");
        router.push({
          pathname: "/team/space/board",
          query: {
            id: router.query.id,
          },
        });
      },
      (err) => {
        console.log(err, "글 게시 실패");
      }
    );
  };

  return (
    <div>
      <form onSubmit={onSubmitPost}>
        <label htmlFor="question">질문</label>
        <textarea name="question" id="" cols="30" rows="10"></textarea>
        <label htmlFor="answer">답</label>
        <textarea name="answer" id="" cols="30" rows="10"></textarea>
        <div className="btns">
          <button>등록</button>
          <Link
            href={{
              pathname: "/team/space/board",
              query: {
                id: router.query.id,
              },
            }}
          >
            <a>취소</a>
          </Link>
        </div>
      </form>
    </div>
  );
}
