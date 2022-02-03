import Pagination from "../../../components/team/board/pagination";
import styles from "../../../scss/team/board/board.module.scss";
import Title from "../../../components/layout/title";
import Image from "next/image";
import Link from "next/link";

import { setAllRooms } from "../../../store/actions/roomAction";
import { getAllRooms } from "../../../api/studyroom";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";

const mapStateToProps = (state) => {
  return {
    rooms: state.roomReducer.curRooms,
    totalPosts: state.roomReducer.curRoomsCount,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setAllRooms: (res) => dispatch(setAllRooms(res)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TeamBoard);

function TeamBoard({ rooms, totalPosts, setAllRooms }) {
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

  //pagination
  const [curPage, setCurPage] = useState(0);
  const [postsPerPage] = useState(6);
  const [keyword, setKeyword] = useState("");
  const paginate = (pageNumber) => setCurPage(pageNumber);

  //filtering keyword
  const onAddKeyword = (event) => {
    if (event.key === "Enter") {
      setKeyword(event.target.value);
      event.target.value = "";
      setCurPage(0);
    }
  };

  // 스터디룸 조회
  useEffect(() => {
    const param = {
      hashtags: keyword,
      page: curPage,
      size: postsPerPage,
    };
    getAllRooms(
      param,
      (res) => {
        const roomList = {
          rooms: res.data.response.content,
          roomsCount: res.data.response.totalElements,
        };
        console.log(roomList);
        setAllRooms(roomList);
      },
      (err) => {
        console.log(err, "스터디를 조회할 수 없습니다.");
      }
    );
  }, [keyword, curPage]);

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
                <Link href="/team/space/create">
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
