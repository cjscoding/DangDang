import Pagination from "../../../components/layout/Pagination";
import styles from "../../../scss/team/board/board.module.scss";
// import Title from "../../../components/layout/Title";
import Link from "next/link";

import { BACKEND_URL } from "../../../config";
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
    router.push({
      pathname: "/team/space",
      query: {
        id,
        page: "info",
      },
    });
  };

  const [newRoomImage, setNewRoomImage] = useState("");
  let newImage;
  if (myRooms.length > 0) newImage = myRooms[0].imageUrl;
  useEffect(() => {
    setNewRoomImage(newRoomImage);
  }, [newImage]);

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

  const getMyRoomList = () => {
    const param = {
      hashtags: searchTags.join(","),
      page: curPage,
      size: postsPerPage,
      sort: "createdAt,desc",
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
  };

  // 스터디룸 조회
  useEffect(() => {
    getMyRoomList();
  }, [searchTags, curPage, newRoomImage]);
  // 스터디룸 조회
  useEffect(() => {
    getMyRoomList();
  }, []);

  return (
    <div className={styles.studyBoard}>
      {/* <Title title="Board"></Title> */}

      <h1 className={styles.title}># 내방들이당</h1>

      <div className={styles.boardContainer}>
        <div className={styles.topBar}>
          <input
            type="text"
            onKeyUp={onAddTag}
            placeholder="검색어를 입력하고 엔터키를 눌러주세요..."
          />

          <div className={styles.btns}>
            <Link href="/team/board">
              <button className={styles.createBtn}>
                <a>스터디 게시판으로</a>
              </button>
            </Link>
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

        {myRooms.length > 0 ? (
          <div className={styles.rooms}>
            {myRooms.map((room) => (
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
        ) : (
          <div className={styles.noRoom}>
            <h2>아직 가입한 스터디가 없어요 ㅜ.ㅜ</h2>

            <button>
              <Link href="/team/board">
                <a>스터디 가입하러 가기</a>
              </Link>
            </button>
          </div>
        )}

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
