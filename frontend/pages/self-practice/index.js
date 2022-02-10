import styles from "../../scss/self-practice/mainComponent.module.scss";

export default function SelfPractice() {
  return (
    <div className="container">
      {/* 로그인 정보가 담겨서 새 창을 띄워줄지,, 의문 */}
      {/* 이후 페이지들 url로 접속시 차단 기능 추가해야함 */}
      <div className={styles.txt}>
      <h1># 혼자연습한당</h1>
        <div>연습하고 싶은 질문을 골라서,<br></br>내 마음에 들 때까지 무한반복 1인 연습모드!</div>
      </div>
      <div className={styles.btnContainer}>
        <button className={styles.mainBtn}
          onClick={() => {
            window.open(`${window.location.href}/interview/select-questionlist`);
          }}
        >
          연습 시작하기
        </button>
        <img src="/images/dangdang_1.png" className={styles.dangdang}></img>
      </div>
      <div className={styles.explain}>
        <div>설명이 들어갈 곳설명이 들어갈 곳설명이 들어갈 곳설명이 들어갈 곳설명이 들어갈 곳
        설명이 들어갈 곳설명이 들어갈 곳설명이 들어갈 곳설명이 들어갈 곳설명이 들어갈 곳설명이 들어갈 곳
        설명이 들어갈 곳설명이 들어갈 곳설명이 들어갈 곳설명이 들어갈 곳설명이 들어갈 곳설명이 들어갈 곳
        설명이 들어갈 곳설명이 들어갈 곳설명이 들어갈 곳
        </div>
      </div>
    </div>
  );
}
