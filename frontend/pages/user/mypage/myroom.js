import Title from "../../../components/layout/title";
import styles from "../../../scss/user/mypage.module.scss";
import Image from "next/image";
import Link from "next/link";
import { connect } from "react-redux";

function mapStateToProps(state) {
  return {
    rooms: state.roomReducer.rooms,
  };
}

// function mapDispatchToProps(){
//     return{

//     }
// }

export default connect(mapStateToProps, null)(MyRooms);

function MyRooms({rooms}) {
  return (
    <div>
      <Title title="Board"></Title>

      <h1 className={styles.title}>내방들이당</h1>

      <div className="container">
        <div className={styles.main}>
          <div className={styles.top}>
            <div className={styles.filter}>
              <label htmlFor="">검색어</label>
              <input type="text" />
            </div>
            <button>
              <Link href="/team-board">
                <a>스터디 게시판으로</a>
              </Link>
            </button>
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
                <Link
                  href={{
                    pathname: "/team-space",
                    query: { no: index },
                  }}
                  as="/team-space"
                  index={index}
                >
                  <a>스터디 참여하기</a>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
