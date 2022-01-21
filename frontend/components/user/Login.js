import Button from "./Button";
export default function Login() {
  return (
    <div>
      <h1>로그인</h1>
      <form method="post">
        <label htmlFor="email">
          <input id="email" type="text" placeholder="이메일" />
        </label>
        <label htmlFor="password">
          <input id="password" type="password" placeholder="비밀번호" />
        </label>
        <button type="submit">로그인</button>
      </form>
      <Button text="Google로 로그인" />
      <Button text="Kakao로 로그인" />
    </div>
  );
}
