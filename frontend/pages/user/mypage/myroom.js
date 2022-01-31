import Pagination from "../../../components/team/board/pagination";
import styles from "../../../scss/user/mypage.module.scss";
import Title from "../../../components/layout/title";
import Image from "next/image";
import Link from "next/link";

import { getMyRooms } from "../../../store/actions/roomAction";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";

function mapStateToProps(state) {
  return {
    myRooms: state.roomReducer.myRooms,
    totalPosts: state.roomReducer.myRoomsCount,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchMyRooms: (param) => {
      const data = getMyRooms(param);
      data.then((res) => dispatch(res));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MyRooms);

function MyRooms({ myRooms, totalPosts, fetchMyRooms }) {
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
    fetchMyRooms(param);
  }, [keyword, curPage]);

  //filtering keyword
  const onAddKeyword = (event) => {
    if (event.key === "Enter") {
      setKeyword(event.target.value);
      event.target.value = "";
      setCurPage(0);
    }
  };

  // 팀 스페이스로 이동 로직
  const router = useRouter();
  const onDetail = (id) => {
    router.push(
      {
        pathname: `/team/space`,
        query: {
          id,
        },
      }
      //   `/team/space`
    );
  };

  return (
    <div>
      <Title title="Board"></Title>

      <h1 className={styles.title}>내방들이당</h1>

      <div className="container">
        <div className={styles.main}>
          <div className={styles.top}>
            <div className={styles.filter}>
              <div className={styles.filter}>
                <input
                  type="text"
                  onKeyPress={onAddKeyword}
                  placeholder="키워드 검색..."
                />
                <p>key : {keyword}</p>
              </div>
            </div>
            <button>
              <Link href="/team/board">
                <a>스터디 게시판으로</a>
              </Link>
            </button>
          </div>

          <div className={styles.rooms}>
            {myRooms?.map((room) => (
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
