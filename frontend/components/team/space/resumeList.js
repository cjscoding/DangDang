import styles from "../../../scss/team/space/resume.module.scss";
import Comment from "./ResumeComment";

import { setResume } from "../../../store/actions/resumeAction";
import {
  getResume,
  updateResume,
  deleteResume,
  createResumeComment,
} from "../../../api/resume";
import { connect } from "react-redux";
import { useEffect, useState } from "react";

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
  const [questionId] = useState(resume.resumeQuestionList[0].id);
  const [resumeId] = useState(resume.id);
  const [question, setQuestion] = useState(
    resume.resumeQuestionList[0].question
  );
  const [answer, setAnswer] = useState(resume.resumeQuestionList[0].answer);
  const [isUpdate, setIsUpdate] = useState(false);
  const [showComment, onShowComment] = useState(false);
  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    console.log(comments);
    setCommentList(comments);
  }, [comments]);

  //자소서 수정
  const onSubmitUpdated = (event) => {
    event.preventDefault();
    const data = {
      resumeId,
      req: {
        resumeQuestionList: [
          {
            id: questionId,
            question,
            answer,
          },
        ],
      },
    };
    updateResume(
      data,
      (res) => {
        console.log(res, "자소서 갱신 성공");
        setIsUpdate(false);
        reload();
      },
      (err) => {
        console.log(err, "자소서 갱신 실패");
      }
    );
  };

  //자소서 삭제
  const onDeleteResume = () => {
    deleteResume(
      resumeId,
      (res) => {
        console.log(res, "자소서 삭제 성공");
        getResume(
          userInfo.id,
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

  const deliverReload = () => reload();
  return (
    <div className={styles.resumeOneItem}>
      <div>
        {isUpdate ? (
          <form onSubmit={onSubmitUpdated}>
            <label htmlFor="question">질문</label>
            <input
              name="question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
            />
            <label htmlFor="answer">답</label>
            <input
              name="answer"
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
            />
            <div className="btns">
              <button>수정완료</button>
              <button onClick={() => setIsUpdate(!isUpdate)}>취소</button>
              <button onClick={() => onShowComment(!showComment)}>댓글</button>
            </div>
          </form>
        ) : (
          <div>
            <div>
              <h4>
                Q{index + 1} : {question}
              </h4>
              <p>
                A{index + 1} : {answer}
              </p>
            </div>

            <div className="btns">
              <button onClick={() => setIsUpdate(!isUpdate)}>수정</button>
              <button onClick={onDeleteResume}>삭제</button>
              <button onClick={() => onShowComment(!showComment)}>
                댓글보기
              </button>
            </div>
          </div>
        )}
        {showComment ? (
          <div>
            <h3>New Comment</h3>
            <div className={styles.user}>
              <span className="author"> {userInfo.nickName}</span>
            </div>
            <form onSubmit={onUploadComment}>
              <input type="text" placeholder="comment..." />
              <button>Upload</button>
            </form>
            <h4>Comments</h4>
            {commentList.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                reload={deliverReload}
                resumeId={resumeId}
                userName={userInfo.nickName}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
