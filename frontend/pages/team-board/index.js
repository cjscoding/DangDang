import Title from "../../components/layout/title";
import styles from "../../scss/team-board/board.module.scss";
import Image from "next/image";
import { useSelector, useDispatch, connect } from "react-redux";
import { useEffect } from "react";
import { fetchrooms } from "../../store/actions/postAction";
import Link from 'next/link';

function mapStateToProps(state) {
  return state.postReducer;
}
function mapDispatchToProps(dispatch) {
  dispatch(fetchrooms());
  return ;
}
export default connect(mapStateToProps, mapDispatchToProps)(Board);

function Board({rooms}) {
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
                  <Link href="/board/create-room">
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
                  <div className={styles.keywords}>
                    {items?.map((item) => <span key={item}># {item}</span>)}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

{/* <Link href="/myrooms:index">
                    <a>스터디 참여하기</a>
                  </Link> */}