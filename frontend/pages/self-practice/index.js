import getStreamPermission from "../../components/webRTC/getStreamPermission";
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
            getStreamPermission("/self-practice/interview/select-questionlist")
          }}
        >
          연습 시작하기
        </button>
        <img src="/images/dangdang_1.png" className={styles.dangdang}></img>
      </div>
      <div className={styles.explain}>
        <h2>연습하기전 STEPS</h2>
        <div className={styles.component1}>
          <h3>#STEP1. 질문 유형 선택</h3>
          <div className={styles.imgBox}>
            <img src="/images/self-practice/pre_step1.jpg" />
          </div>
          <pre className={styles.explainContents}>
            <p>
            기본 질문을 선택하시면, 즐겨찾기로 많이 등록된 질문들 5개로 빠르게 <strong>STEP3</strong>로 넘어갈 수 있습니다.
            <br/>
            질문 선택을 고르시면, 다양한 질문을 직접 뽑아서 면접연습을 하실 수 있습니다.
            </p>
          </pre>
        </div>
        <div className={styles.component1}>
          <h3>#STEP2. 질문 리스트 커스텀</h3>
          <div className={styles.imgBox}>
            <img src="/images/self-practice/pre_step2.jpg" />
          </div>
          <pre className={styles.explainContents}>
            <p>
            원하는 질문이 없으면, 직접 입력해서 등록할 수 있습니다.
            <br/>
            로그인을 하시면, 즐겨찾기 등록한 질문 리스트와, 작성한 질문 리스트에서도 선택할 수 있습니다.
            </p>
          </pre>
        </div>
        <div className={styles.component1}>
          <h3>#STEP3. 디바이스 설정</h3>
          <div className={styles.imgBox}>
            <img src="/images/self-practice/pre_step3.jpg" />
          </div>
          <pre className={styles.explainContents}>
            <p>
            연습하기전, 마지막으로 연결된 카메라와, 마이크, 스피커를 확인해보세요.
            </p>
          </pre>
        </div>
        <br/>
        <h2>실전같은 면접연습</h2>
        <div className={styles.component1}>
          <h3>#MODE1. 질문 보기</h3>
          <div className={styles.imgBox}>
            <img src="/images/self-practice/ing_mode1.jpg" />
          </div>
          <pre className={styles.explainContents}>
            <p>
            질문리스트의 질문을 TTS로 읽어주지만, MODE1을 통해 질문을 보실 수 있습니다.
            </p>
          </pre>
        </div>
        <div className={styles.component1}>
          <h3>#MODE2. 녹화 화면</h3>
          <div className={styles.imgBox}>
            <img src="/images/self-practice/ing_mode2.jpg" />
          </div>
          <pre className={styles.explainContents}>
            <p>
            녹화중인 자신의 얼굴을 확인하실 수 있습니다.
            </p>
          </pre>
        </div>
        <div className={styles.component1}>
          <h3>#MODE3. 면접관</h3>
          <div className={styles.imgBox}>
            <img src="/images/self-practice/ing_mode3.jpg" />
          </div>
          <pre className={styles.explainContents}>
            <p>
            저장한 질문에 대한 영상을 재생하여, 자신의 면접모습을 확인할 수 있습니다.
            </p>
          </pre>
        </div>
        <br/>
        <h2>면접연습을 마치고...</h2>
        <div className={styles.component1}>
          <div className={styles.imgBox}>
            <img src="/images/self-practice/aft_end1.jpg" />
          </div>
          <pre className={styles.explainContents}>
            <p>
            랜덤한 가상의 면접관이 나와, 실전 면접처럼 연습하실 수 있습니다.
            <br/>
            다운로드로 자신의 연습결과를 저장하실 수 있습니다.
            </p>
          </pre>
        </div>
      </div>
    </div>
  );
}
