import Button from "./Button";
import styles from "../../scss/user/login-signup.module.scss";
import { useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import {
  setShowModal,
  setIsLogin,
  setUserInfo,
} from "../../store/actions/userAction";
import { getToken, getUserInfo } from "../../api/user";
import userReducer from "../../store/reducers/userReducer";

function mapStateToProps({ userReducer }) {
  return {
    isLogin: userReducer.isLogin,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setShowModal: (show) => dispatch(setShowModal(show)),
    setIsLogin: (isLogin) => dispatch(setIsLogin(isLogin)),
    setUserInfo: (userInfo) => dispatch(setUserInfo(userInfo)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);

function Login({ setShowModal, isLogin, setIsLogin, setUserInfo }) {
  const router = useRouter();
  const [values, setValues] = useState({
    email: "",
    password: "",
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
    getToken(
      values,
      (response) => {
        getUserInfo(
          ({ data: { response } }) => {
            const userInfo = {
              email: response.email,
              nickName: response.nickName,
            };
            setUserInfo(userInfo);
          },
          (error) => {
            console.log(error);
          }
        );
        setShowModal(false);
      },
      (error) => {
        alert("이메일과 비밀번호를 확인해주세요.");
      }
    );
  };

  const socialLoginRequest = (provider) => {
    window.location.href = `http://localhost:8080/oauth2/authorize/${provider}?redirect_uri=http://localhost:3000/user/oauth2/redirect?destination=${router.pathname}`;
  };

  return (
    <div className={styles.body}>
      <h1>로그인</h1>
      <form className={styles.form} method="post" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">
            이메일
            <input
              id="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              placeholder="이메일"
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
              placeholder="비밀번호"
              required
            />
          </label>
        </div>
        <button type="submit">로그인</button>
      </form>
      <p>
        회원이 아니세요? <a onClick={() => setIsLogin(!isLogin)}>회원가입</a>
      </p>
      <Button
        text="Google로 로그인"
        onClick={() => socialLoginRequest("google")}
      />
      <Button
        text="Kakao로 로그인"
        onClick={() => socialLoginRequest("kakao")}
      />
    </div>
  );
}
