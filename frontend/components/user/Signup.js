import Button from "./Button";
export default function Signup() {
  return (
    <div>
      <h1>회원가입</h1>
      <form>
        <div>
          <label for="nickname">
            이름
            <input
              id="nickname"
              type="text"
              placeholder="이름을 입력하세요"
              required
            />
          </label>
        </div>
        <div>
          <label for="password">
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
          <label for="email">
            이메일
            <input
              id="email"
              type="email"
              placeholder="이메일을 입력하세요"
              required
            />
          </label>
        </div>
        <button type="submit">회원가입</button>
      </form>
      <Button text="Google로 시작하기" />
      <Button text="Kakao로 시작하기" />
      {/* <Button text="이메일로 시작하기" /> */}
    </div>
  );
}
