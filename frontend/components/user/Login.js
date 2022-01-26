import Button from "./Button";
import styles from "../../scss/user/login-signup.module.scss";
import { getToken } from "../../api/user";
import { useState } from "react";

export default function Login({ onClick }) {
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
      ({ headers: { authorization, refreshtoken } }) => {
        console.log(authorization);
        console.log(refreshtoken);
      },
      (error) => console.log(error)
    );
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
        회원이 아니세요? <a onClick={onClick}>회원가입</a>
      </p>
      <Button text="Google로 로그인" />
      <Button text="Kakao로 로그인" />
    </div>
  );
}
