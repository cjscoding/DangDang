import styles from "../../scss/team-board/board.module.scss";
import Title from "../../components/layout/title";
import Pagination from "../../components/team-board/pagination";

import Router from "next/router";
import Image from "next/image";
import Link from "next/link";

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { fetchRooms } from "../../store/actions/roomAction";

function mapStateToProps(state) {
  return {
    rooms: state.roomReducer.allRooms,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchAllRooms: (param) => {
      const data = fetchRooms(param);
      data.then((res) => dispatch(res));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamBoard);

function TeamBoard({ rooms, fetchAllRooms }) {
  //스터디룸 상세보기 페이지 연결 로직
  function onDetail(event) {
    event.preventDefault();
    //이후 방 고유번호(roomNo) 옵션 붙어서 이동
    Router.replace("/team-board/team-detail", "team/detail");
  }

  //전체 스터디룸 조회
  useEffect(() => {
    fetchAllRooms();
  }, []);

  //pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [postsPerPage] = useState(9);

  //   useEffect(() => {
  //     fetchAllRooms({
  //       page: currentPage,
  //       size: postsPerPage,
  //     });
  //   }, [currentPage]);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  //room filtering
  const [keyword, setKeyword] = useState("");

  const onChangeKeyword = (event) => {
    const { value } = event.target;
    console.log(value);
    setKeyword(value);
  };

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
              <input
                type="text"
                onChange={onChangeKeyword}
                placeholder="키워드 검색..."
              />
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
            {keyword === ""
              ? rooms?.map((room, index) => (
                  <div className={styles.room} key={index} onClick={onDetail}>
                    <Image
                      src="/vercel.svg"
                      alt="Vercel Logo"
                      width={300}
                      height={250}
                    />
                    <span> {room.id}</span>
                    <span> {room.name}</span>
                    <span> {room.goal}</span>
                    <span> {room.description}</span>
                    {room.hashTags?.map((hashTag, index) => (
                      <span key={index}># {hashTag}</span>
                    ))}
                  </div>
                ))
              : rooms
                  ?.filter((room) => room.hashTags.includes(keyword))
                  .map((room, index) => (
                    <div className={styles.room} key={index} onClick={onDetail}>
                      <Image
                        src="/vercel.svg"
                        alt="Vercel Logo"
                        width={300}
                        height={250}
                      />
                      <span> {room.id}</span>
                      <span> {room.name}</span>
                      <span> {room.goal}</span>
                      <span> {room.description}</span>
                      {room.hashTags?.map((hashTag, index) => (
                        <span key={index}># {hashTag}</span>
                      ))}
                    </div>
                  ))}
          </div>

          <Pagination
            postsPerPage={postsPerPage}
            totalPosts={rooms.length}
            paginate={paginate}
          />
        </div>
      </div>
    </div>
  );
}
