import NavBar from "../../components/Navbar";

export default function SelfPractice() {
  return (
    <>
      {/* 로그인 정보가 담겨서 새 창을 띄워줄지,, 의문 */}
      <button
        onClick={() => {
          window.open(`${window.location.href}/interview/select-questionlist`);
        }}
      >
        화상면접 ㄱㄱ
      </button>
    </>
  );
}
