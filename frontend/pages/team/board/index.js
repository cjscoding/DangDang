import styles from "../../../scss/team/board/board.module.scss";
import Title from "../../../components/layout/title";
import Pagination from "../../../components/team/board/pagination";

import Image from "next/image";
import Link from "next/link";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { fetchRooms } from "../../../store/actions/roomAction";

function mapStateToProps(state) {
  return {
    rooms: state.roomReducer.curRooms,
    totalPosts: state.roomReducer.curRoomsCount,
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

function TeamBoard({ rooms, totalPosts, fetchAllRooms }) {
  //pagination
  const [curPage, setCurPage] = useState(0);
  const [postsPerPage] = useState(12);
  const [keyword, setKeyword] = useState("");
  const param = {
    hashtags: keyword,
    page: curPage,
    size: postsPerPage,
  };

  const paginate = (pageNumber) => {
    setCurPage(pageNumber);
  };

  // 스터디룸 조회
  useEffect(() => {
    fetchAllRooms(param);
  }, [keyword, curPage]);

  //filtering keyword
  const onAddKeyword = (event) => {
    if (event.key === "Enter") {
      setKeyword(event.target.value);
      event.target.value = "";
      setCurPage(0);
    }
  };

  //스터디룸 상세보기 페이지 연결 로직
  const router = useRouter();

  const onDetail = (id) => {
    router.push(
      {
        pathname: `/team/board/detail/${id}`,
        query: {
          id,
        },
      },
      `/team/board/detail/${id}`
    );
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
                onKeyPress={onAddKeyword}
                placeholder="키워드 검색..."
              />
              <p>key : {keyword}</p>
            </div>
            <div className={styles.createRoom}>
              <button>
                <Link href="/user/mypage/myroom">
                  <a>내방 보러가기</a>
                </Link>
              </button>
              <button>
                <Link href="/team/space/create-room">
                  <a>방 생성</a>
                </Link>
              </button>
            </div>
          </div>

          <div className={styles.rooms}>
            {rooms?.map((room) => (
              <div
                className={styles.room}
                key={room.id}
                onClick={() => onDetail(room.id)}
              >
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
            paginate={paginate}
            totalCount={totalPosts}
            postsPerPage={postsPerPage}
          />
        </div>
      </div>
    </div>
  );
}
