import { useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { addInterviewQuestion } from "../../api/interviewQuestion";
import { setShowModal, setIsLoginModal } from "../../store/actions/userAction";

function mapStateToProps({ userReducer }) {
  return {
    isLogin: userReducer.isLogin,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setShowModal: (show) => dispatch(setShowModal(show)),
    setIsLoginModal: (isLoginModal) => dispatch(setIsLoginModal(isLoginModal)),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(addQuestion);

function addQuestion({ isLogin, setShowModal, setIsLoginModal }) {
  const router = useRouter();
  if (isLogin) {
    const options = ["공통", "기술", "인성", "기타"];
    const [values, setValues] = useState({
      field: options[0],
      question: "",
      answer: "",
    });

    const handleChange = ({ target: { id, value } }) => {
      const nextValues = {
        ...values,
        [id]: value,
      };
      setValues(nextValues);
    };

    const handleSubmit = (event) => {
      event.preventDefault();
      addInterviewQuestion(
        values,
        (response) => {
          console.log(response);
          alert("질문 등록 성공!");
          router.push("/interview-question");
        },
        (error) => console.log(error)
      );
    };

    return (
      <div>
        내 질문 등록하기
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="field">
              분류
              <select id="field" onChange={handleChange}>
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div>
            <label htmlFor="question">
              질문
              <input
                id="question"
                type="text"
                value={values.question}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div>
            <label htmlFor="answer">
              답
              <textarea
                id="answer"
                value={values.answer}
                onChange={handleChange}
              />
            </label>
          </div>
          <button type="submit">등록하기</button>
        </form>
      </div>
    );
  } else {
    return (
      <div>
        당당!에 로그인하고 내 질문을 추가해 보세요.
        <a
          onClick={() => {
            setShowModal(true);
            setIsLoginModal(true);
          }}
        >
          로그인
        </a>
      </div>
    );
  }
}
