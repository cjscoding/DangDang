import Button from "./Button";
import styles from "../../scss/user/login-signup.module.scss";
import { useState } from "react";
import { connect } from "react-redux";
import {
  resetUserInfo,
  setIsLoginModal,
  setShowModal,
} from "../../store/actions/userAction";
import { signUpRequest, registUserImage } from "../../api/user";

function mapStateToProps({ userReducer }) {
  return {
    isLoginModal: userReducer.isLoginModal,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setShowModal: (show) => dispatch(setShowModal(show)),
    setIsLoginModal: (isLoginModal) => dispatch(setIsLoginModal(isLoginModal)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup);

function Signup({ isLoginModal, setIsLoginModal, setShowModal }) {
  const [image, setImage] = useState("");
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
      (response) => {
        alert("회원가입 완료!");
        console.log(response);
        console.log(image);
        registUserImage(
          image,
          (res) => {
            console.log(res, "유저 이미지 변경 성공");
          },
          (err) => {
            console.log(err, "유저 이미지 변경 실패");
          }
        );
        setShowModal(false);
      },
      (error) => console.log(error)
    );
  };

  //유저 이미지 설정 시 state 값 변환
  const onSetImage = (event) => setImage(event.target.files[0]);

  return (
    <div className={styles.body}>
      <h1>회원가입</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div>
          <label htmlFor="profile">프로필 사진</label>
          <input type="file" name="profile" onChange={onSetImage} />
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
        계정이 있으세요?{" "}
        <a onClick={() => setIsLoginModal(!isLoginModal)}>로그인</a>
      </p>
      <Button text="Google로 시작하기" />
      <Button text="Kakao로 시작하기" />
    </div>
  );
}
