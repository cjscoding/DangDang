import Title from "../../components/layout/title";
import styles from "../../scss/team-board/board.module.scss";
import Image from "next/image";
import Link from "next/link";
import { connect } from "react-redux";

function mapStateToProps(state) {
  return {
    rooms: state.roomReducer.rooms,
  };
}

export default connect(mapStateToProps, null)(TeamBoard);

function TeamBoard({ rooms }) {
  return (
    <div>
      <Title title="Board"></Title>

      <h1 className={styles.title}>스터디 구한당</h1>

      <div className="container">
        <div className={styles.categories}>
          <ul>
            <li>All</li>
            <li>FrontEnd</li>
            <li>BackEnd</li>
          </ul>
        </div>

        <div className={styles.main}>
          <div className={styles.top}>
            <div className={styles.filter}>
              <label htmlFor="">검색어</label>
              <input type="text" />
            </div>
            <div className={styles.createRoom}>
              <button>
                <Link href="/mypage">
                  <a>내방 보러가기</a>
                </Link>
              </button>
              <button>
                <Link href="/team-board/create-room">
                  <a>방 생성</a>
                </Link>
              </button>
            </div>
          </div>

          <div className={styles.rooms}>
            {rooms?.map((items, index) => (
              <div className={styles.room} key={index}>
                <Image
                  src="/vercel.svg"
                  alt="Vercel Logo"
                  width={300}
                  height={250}
                />
                <span key={index}> {items.host}</span>
                <span key={index}> {items.goal}</span>
                <span key={index}> {items.desc}</span>
                <span key={index}> {items.kakao}</span>
                {items.hashtag?.map((tag, index) => (
                  <span key={index}># {tag}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
