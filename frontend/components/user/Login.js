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
import { BACKEND_URL, FRONTEND_URL } from "../../config";

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
              role: response.role,
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
        document.body.style.overflow = "unset";
        setShowModal(false);
      },
      (error) => {
        alert("???????????? ??????????????? ??????????????????.");
      }
    );
  };

  const socialLoginRequest = (provider) => {
    window.location.href = `${BACKEND_URL}/oauth2/authorize/${provider}?redirect_uri=${FRONTEND_URL}/user/oauth2/redirect?destination=${router.pathname}`;
  };

  return (
    <div className={styles.body}>
      <h1>?????????</h1>
      <p className={styles.loginText}>
        ???????????? ????????? ??????????????????.
        <br /> ??????????????? <span id={styles.dangdang}>??????!</span>??? ??????
        ???????????? ????????? ?????????!
      </p>
      <form className={styles.form} method="post" onSubmit={handleSubmit}>
        <div>
          {/* <span className={styles.span}><i className="fa-thin fa-envelope"></i></span> */}
          <label htmlFor="email" className={styles.label}>
            <span className={styles.span}>
              <i className="fas fa-envelope"></i>
            </span>
            <input
              id="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              placeholder="???????????? ??????????????????"
              required
            />
          </label>
        </div>
        <div>
          <label htmlFor="password" className={styles.label}>
            <span className={styles.span}>
              <i className="fas fa-lock"></i>
            </span>
            <input
              id="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              placeholder="??????????????? ??????????????????"
              required
            />
          </label>
        </div>
        <button type="submit" id={styles.submitBtn}>
          ?????????
        </button>
      </form>
      <p className={styles.moveTo}>
        ?????? ????????? ?????????????{" "}
        <a onClick={() => setIsLoginModal(!isLoginModal)}>????????????</a>
      </p>
      <a onClick={() => socialLoginRequest("google")} target="_blank">
        <img src="/images/btn_google_signin_dark_normal_web.png"></img>
      </a>
      <a onClick={() => socialLoginRequest("kakao")}>
        <img src="/images/kakao_login_medium_narrow.png"></img>
      </a>

      {/* <Button
        text="Google??? ?????????"
        onClick={() => socialLoginRequest("google")}
      />
      <Button
        text="Kakao??? ?????????"
        onClick={() => socialLoginRequest("kakao")}
      /> */}
    </div>
  );
}
