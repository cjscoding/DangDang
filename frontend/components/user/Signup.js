import Button from "./Button";
import styles from "../../scss/user/login-signup.module.scss";
import { useState } from "react";
import { connect } from "react-redux";
import { setIsLogin } from "../../store/actions/userAction";
import { signUpRequest } from "../../api/user";

function mapStateToProps({ userReducer }) {
  return {
    isLogin: userReducer.isLogin,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setShowModal: (show) => dispatch(setShowModal(show)),
    setIsLogin: (isLogin) => dispatch(setIsLogin(isLogin)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup);

function Signup({ isLogin, setIsLogin }) {
  const [values, setValues] = useState({
    email: "",
    password: "",
    nickName: "",
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
    signUpRequest(
      values,
      () => {
        alert("회원가입 완료!");
        onClick();
      },
      (error) => console.log(error)
    );
  };

  return (
    <div className={styles.body}>
      <h1>회원가입</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">
            이메일
            <input
              id="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              placeholder="이메일을 입력하세요"
              required
            />
          </label>
        </div>
        <div>
          <label htmlFor="password">
            비밀번호
            <input
              id="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
              required
            />
          </label>
        </div>
        <div>
          <label htmlFor="nickName">
            이름
            <input
              id="nickName"
              type="text"
              value={values.nickName}
              onChange={handleChange}
              placeholder="이름을 입력하세요"
              required
            />
          </label>
        </div>
        <button type="submit">회원가입</button>
      </form>
      <p>
        계정이 있으세요? <a onClick={() => setIsLogin(!isLogin)}>로그인</a>
      </p>
      <Button text="Google로 시작하기" />
      <Button text="Kakao로 시작하기" />
      {/* <Button text="이메일로 시작하기" /> */}
    </div>
  );
}
