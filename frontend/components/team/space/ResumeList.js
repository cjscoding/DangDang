import styles from "../../../scss/team/space/resume.module.scss";
import Comment from "./ResumeComment";

import { setResume } from "../../../store/actions/resumeAction";
import {
  getResume,
  deleteResume,
  createResumeComment,
} from "../../../api/resume";
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

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

export default connect(mapStateToProps, mapDispatchToProps)(ResumeList);

function ResumeList({ userInfo, setResume, resume, comments, index, reload }) {
  const router = useRouter();
  const [questionId] = useState(resume.resumeQuestionList[0].id);
  const [resumeId] = useState(resume.id);
  const [question] = useState(resume.resumeQuestionList[0].question);
  const [answer] = useState(resume.resumeQuestionList[0].answer);
  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    console.log(comments);
    setCommentList(comments);
  }, [comments]);

  //자소서 삭제
  const onDeleteResume = () => {
    const data = {
      studyId: router.query.id,
      resumeId,
    };

    deleteResume(
      data,
      (res) => {
        alert("자소서 삭제 성공");
        console.log(res);
        const data = {
          studyId: router.query.id,
          userId: userInfo.id,
        };

        getResume(
          data,
          (res) => {
            const resArray = res.data.response;
            setResume(resArray);
            console.log(res, "자소서 불러오기 성공");
            reload();
          },
          (err) => {
            console.log(err, "자소서 불러오기 실패");
          }
        );
      },
      (err) => {
        console.log(err, "자소서 삭제 실패");
      }
    );
  };

  //댓글 등록
  const onUploadComment = (event) => {
    event.preventDefault();
    const data = {
      resumeId,
      obj: {
        content: event.target[0].value,
      },
    };
    createResumeComment(
      data,
      (res) => {
        console.log(res, "댓글 등록 완료");
        reload();
      },
      (err) => {
        console.log(err, "댓글 등록 실패");
      }
    );
    event.target[0].value = "";
  };

  //자소서 수정 페이지로 이동
  const onMoveToUpdate = () => {
    router.push(
      {
        pathname: "/team/space/resume/update",
        query: {
          id: router.query.id,
          questionId,
          resumeId,
          question,
          answer,
        },
      },
      "/team/space/resume/update"
    );
  };

  const deliverReload = () => reload();

  return (
    <div className={styles.resumeItem}>
      <div className={styles.resumeContent}>
        <div className={styles.question}>
          <h3>{`Q${index + 1} : ${question}`}</h3>

          <div className={styles.btnBox}>
            <button onClick={onMoveToUpdate}>
              <i className="fas fa-pen"></i>
            </button>
            <button onClick={onDeleteResume}>
              <i className="fas fa-trash"></i>
            </button>
          </div>
        </div>
        <p>{answer}</p>
      </div>

      <div className={styles.commentBox}>
        <form onSubmit={onUploadComment}>
          <input type="text" placeholder="댓글을 남겨주세요..." />
          <button>등록</button>
        </form>
        {commentList.length > 0
          ? commentList.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                reload={deliverReload}
                resumeId={resumeId}
                userName={comment.writerNickname}
                userImage={comment.writerImageUrl}
              />
            ))
          : null}
      </div>
    </div>
  );
}

//
