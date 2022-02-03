import Pagination from "../../../components/team/board/pagination";
import styles from "../../../scss/user/mypage.module.scss";
import Title from "../../../components/layout/title";
import Image from "next/image";
import Link from "next/link";

import { setMyRooms } from "../../../store/actions/roomAction";
import { getMyRooms } from "../../../api/studyroom";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";

const mapStateToProps = (state) => {
  return {
    myRooms: state.roomReducer.myRooms,
    totalPosts: state.roomReducer.myRoomsCount,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setMyRooms: (res) => dispatch(setMyRooms(res)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyRooms);

function MyRooms({ myRooms, totalPosts, setMyRooms }) {
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
    getMyRooms(
      param,
      (res) => {
        const myRoomList = {
          myRooms: res.data.response.content,
          myRoomsCount: res.data.response.totalElements,
        };
        setMyRooms(myRoomList);
        console.log(myRoomList);
      },
      (err) => {
        console.log(err, "마이스터디를 조회할 수 없습니다.");
      }
    );
  }, [keyword, curPage]);

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
            {myRooms.length > 0 ? (
              myRooms.map((room) => (
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
              ))
            ) : (
              <div>
                <h2>아직 가입한 스터디가 없어요</h2>
                <button>
                  <Link href="/team/board">
                    <a>스터디 가입하러 가기</a>
                  </Link>
                </button>
              </div>
            )}
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
