import styles from "../../scss/self-practice/mainComponent.module.scss";

export default function SelfPractice() {
  return (
    <>
      {/* 로그인 정보가 담겨서 새 창을 띄워줄지,, 의문 */}
      {/* 이후 페이지들 url로 접속시 차단 기능 추가해야함 */}
      <div className={styles.btnContainer}>
        <span className={styles.mainBtn}
          onClick={() => {
            window.open(`${window.location.href}/interview/select-questionlist`);
          }}
        >
          화상면접 ㄱㄱ
        </span>
      </div>
      <section>
        이미지와 함께 설명,,,
      </section>
    </>
  );
}
