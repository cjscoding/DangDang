import Button from "./Button";
import styles from "../../scss/user/login-signup.module.scss";
import { useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import {
  setShowModal,
  setIsLoginModal,
  setUserInfo,
  setIsMoveTeamStudy,
} from "../../store/actions/userAction";
import { getToken, getUserInfo } from "../../api/user";
import { BACKEND_URL } from "../../config";

function mapStateToProps({ userReducer }) {
  return {
    isLoginModal: userReducer.isLoginModal,
    isMoveTeamStudy: userReducer.isMoveTeamStudy,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setShowModal: (show) => dispatch(setShowModal(show)),
    setIsLoginModal: (isLoginModal) => dispatch(setIsLoginModal(isLoginModal)),
    setUserInfo: (userInfo) => dispatch(setUserInfo(userInfo)),
    setIsMoveTeamStudy: (isMoveTeamStudy) =>
      dispatch(setIsMoveTeamStudy(isMoveTeamStudy)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);

function Login({
  setShowModal,
  isLoginModal,
  setIsLoginModal,
  setUserInfo,
  isMoveTeamStudy,
  setIsMoveTeamStudy,
}) {
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
              id: response.id,
              email: response.email,
              nickName: response.nickName,
              imageUrl: response.imageUrl,
            };
            setUserInfo(userInfo);
            if (isMoveTeamStudy) router.push("/user/mypage/myroom");
            setIsMoveTeamStudy(false);
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
    window.location.href = `${BACKEND_URL}/oauth2/authorize/${provider}?redirect_uri=http://localhost:3000/user/oauth2/redirect?destination=${router.pathname}`;
  };

  return (
    <div className={styles.body}>
      <h1>로그인</h1>
      <h4>로그인이 필요한 서비스입니다.<br/> 로그인하고 <span id={styles.dangdang}>당당!</span>의 모든 서비스를 이용해 보세요!</h4>
      <form className={styles.form} method="post" onSubmit={handleSubmit}>
        <div>
          <span className={styles.span}><i className="fa-thin fa-envelope"></i></span>
          <label htmlFor="email" className={styles.label}>
            {/* <i className="fas fa-angry"></i> */}
            <input
              id="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              placeholder="이메일을 입력해주세요"
              required
            />
          </label>
        </div>
        <div>
          <label htmlFor="password">
            <input
              id="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력해주세요"
              required
            />
          </label>
        </div>
        <button type="submit" id={styles.submitBtn}>로그인</button>
      </form>
      <p>
        아직 회원이 아니세요?{" "}
        <a onClick={() => setIsLoginModal(!isLoginModal)}>회원가입</a>
      </p>
    <a onClick={() => socialLoginRequest("google")} target="_blank"><img src="/images/btn_google_signin_dark_normal_web.png"></img></a>
    <a onClick={() => socialLoginRequest("kakao")}><img src="/images/kakao_login_medium_narrow.png"></img></a>

      {/* <Button
        text="Google로 로그인"
        onClick={() => socialLoginRequest("google")}
      />
      <Button
        text="Kakao로 로그인"
        onClick={() => socialLoginRequest("kakao")}
      /> */}
    </div>
  );
}
