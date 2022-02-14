import Pagination from "../../../components/layout/Pagination";
import styles from "../../../scss/team/board/board.module.scss";
import Title from "../../../components/layout/Title";
import Link from "next/link";

import { BACKEND_URL } from "../../../config";
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
        pathname: `/team/board/detail`,
        query: {
          id,
        },
      }
      //   `/team/board/detail/${id}`
    );
  };

  //pagination
  const [curPage, setCurPage] = useState(0);
  const [postsPerPage] = useState(9);
  const [searchTags, setSearchTags] = useState([]);
  const paginate = (pageNumber) => setCurPage(pageNumber);

  //filtering keyword
  const onAddTag = (event) => {
    event.preventDefault();
    if (event.key === "Enter") {
      const newTag = event.target.value;
      if (newTag == "") {
        console.log("키워드를 입력해주세요.");
      } else if (searchTags.indexOf(newTag) === -1) {
        setSearchTags([...searchTags, newTag]);
        event.target.value = "";
        setCurPage(0);
      } else {
        console.log("이미 존재하는 키워드입니다.");
        event.target.value = "";
      }
    }
  };
  const onRemoveTag = (event) => {
    setSearchTags(searchTags.filter((tag) => tag != event.target.value));
    setCurPage(0);
  };

  // 스터디룸 조회
  useEffect(() => {
    const param = {
      hashtags: searchTags.join(","),
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
  }, [searchTags, curPage]);

  return (
    <div className={styles.studyBoard}>
      <Title title="Board"></Title>

      <h1 className={styles.title}># 스터디구한당</h1>

      <div className={styles.boardContainer}>
        <div className={styles.topBar}>
          <input
            type="text"
            onKeyUp={onAddTag}
            placeholder="검색어를 입력하고 엔터키를 눌러주세요..."
          />

          <div className={styles.btns}>
            <button className={styles.createBtn}>
              <Link href="/team/space/create">
                <a>방 생성하기</a>
              </Link>
            </button>

            <button className={styles.goMyRoomBtn}>
              <Link href="/user/mypage/myroom">
                <a>내 방으로</a>
              </Link>
            </button>
          </div>
        </div>

        <div className={styles.tagContainer}>
          {searchTags.map((tag) => (
            <div key={tag} className={styles.tagItem}>
              {tag}{" "}
              <button value={tag} onClick={onRemoveTag}>
                x
              </button>
            </div>
          ))}
        </div>

        <div className={styles.rooms}>
          {rooms?.map((room) => (
            <div
              className={styles.room}
              key={room.id}
              onClick={() => onDetail(room.id)}
            >
              <div className={styles.imgBox}>
                {room.imageUrl !== null && room.imageUrl !== "default.jpg" ? (
                  <img src={`${BACKEND_URL}/files/images/${room.imageUrl}`} />
                ) : (
                  <img src="/images/dangdang_1.png" />
                )}
              </div>

              <div className={styles.details}>
                <div className={styles.mainDetails}>
                  <span className={styles.roomName}>{room.name}</span>
                  <span className={styles.roomNumber}>
                    <i className="fas fa-user-friends"></i> {room.number}
                  </span>
                </div>

                <div className={styles.tagBox}>
                  {room.hashTags?.map((hashTag) => (
                    <span key={hashTag}># {hashTag} </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.pagination}>
          <Pagination
            curPage={curPage}
            paginate={paginate}
            totalCount={totalPosts}
            postsPerPage={postsPerPage}
          />
        </div>
      </div>
    </div>
  );
}
