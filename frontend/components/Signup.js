import Button from "./user/Button";
export default function Signup({ isHidden }) {
  return (
    <div className={isHidden ? "hidden" : ""}>
      <div className="overlay"></div>
      <div className="content">
        <h1>회원가입</h1>
        <Button text="Google로 시작하기" />
        <Button text="Kakao로 시작하기" />
        <Button text="이메일로 시작하기" />
      </div>

      <style jsx>
        {`
          .hidden {
            display: none;
          }
        `}
      </style>
    </div>
  );
}
