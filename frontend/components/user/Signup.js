import Button from "./Button";
import styles from "../../scss/user/login-signup.module.scss";

export default function Signup({ onClick }) {
  return (
    <div className={styles.body}>
      <h1>회원가입</h1>
      <form className={styles.form}>
        <div>
          <label htmlFor="email">
            이메일
            <input
              id="email"
              type="email"
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
              placeholder="비밀번호를 입력하세요"
              required
            />
          </label>
        </div>
        <div>
          <label htmlFor="nickname">
            이름
            <input
              id="nickname"
              type="text"
              placeholder="이름을 입력하세요"
              required
            />
          </label>
        </div>

        <button type="submit">회원가입</button>
      </form>
      <p>
        계정이 있으세요? <a onClick={onClick}>로그인</a>
      </p>
      <Button text="Google로 시작하기" />
      <Button text="Kakao로 시작하기" />
      {/* <Button text="이메일로 시작하기" /> */}
    </div>
  );
}
