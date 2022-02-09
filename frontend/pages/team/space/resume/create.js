import Link from "next/link";

import { createResume } from "../../../../api/resume";
import { useRouter } from "next/router";
import { connect } from "react-redux";

const mapStateToProps = (state) => {
  return {
    userInfo: state.userReducer.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setResume: (userId) => dispatch(setResume(userId)),
  };
};

export default connect(mapStateToProps, null)(CreateResume);

function CreateResume({ userInfo }) {
  const router = useRouter();

  const onSubmitResume = (event) => {
    event.preventDefault();
    console.log(event.target[0].value);
    console.log(event.target[1].value);
    const req = {
      resumeQuestionList: [
        {
          question: event.target[0].value,
          answer: event.target[1].value,
        },
      ],
    };
    createResume(
      req,
      (res) => {
        console.log(res, "자소서 등록 성공");
        router.push({
          pathname: "/team/space/resume",
          query: {
            id: router.query.id,
          },
        });
      },
      (err) => {
        console.log(err, "자소서 등록 실패");
      }
    );
  };

  return (
    <div>
      <form className="question" onSubmit={onSubmitResume}>
        <label htmlFor="question">질문</label>
        <textarea name="question" id="" cols="30" rows="10"></textarea>
        <label htmlFor="answer">답</label>
        <textarea name="answer" id="" cols="30" rows="10"></textarea>
        <button>등록</button>
        <Link
          href={{
            pathname: "/team/space/resume",
            query: {
              id: router.query.id,
            },
          }}
        >
          <a>취소</a>
        </Link>
      </form>
    </div>
  );
}
