import styles from "../../scss/team-board/board.module.scss";
import Title from "../../components/layout/title";
import Router from "next/router";
import Image from "next/image";
import Link from "next/link";

import { useEffect } from "react";
import { connect } from "react-redux";
import { fetchRooms } from "../../store/actions/roomAction";

function mapStateToProps(state) {
  return {
    allRooms: state.roomReducer,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchAllRooms: () => {
      const data = fetchRooms();
      data.then((res) => dispatch(res));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamBoard);

function TeamBoard({ allRooms, fetchAllRooms }) {
  function onDetail(event) {
    event.preventDefault();
    //이후 방 고유번호(roomNo) 옵션 붙어서 이동
    Router.replace("/team-board/team-detail", "team/detail");
  }

  useEffect(() => {
    fetchAllRooms();
  }, []);

  const rooms = allRooms.allRooms;
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
                <Link href="/user/mypage/myroom">
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
              <div className={styles.room} key={index} onClick={onDetail}>
                <Image
                  src="/vercel.svg"
                  alt="Vercel Logo"
                  width={300}
                  height={250}
                />
                <span> {items.id}</span>
                <span> {items.name}</span>
                <span> {items.goal}</span>
                <span> {items.description}</span>
                {items.hashTags?.map((tag, index) => (
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
