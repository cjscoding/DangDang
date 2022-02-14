import styles from "../../../../scss/team/space/teamboard.module.scss";
import Pagination from "../../../../components/layout/Pagination";
import Layout from "../../../../components/team/space/Layout";
import Link from "next/link";

import { setRoomInfo } from "../../../../store/actions/roomAction";
import { setPosts } from "../../../../store/actions/boardAction";
import { getRoomInfo } from "../../../../api/studyroom";
import { getPosts } from "../../../../api/board";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { connect } from "react-redux";

const mapStateToProps = (state) => {
  return {
    roomInfo: state.roomReducer.curRoomInfo,
    roomHost: state.roomReducer.curRoomHost,
    userInfo: state.userReducer.user,
    posts: state.boardReducer.posts,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setRoomInfo: (roomData) => dispatch(setRoomInfo(roomData)),
    setPosts: (posts) => dispatch(setPosts(posts)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Board);

function Board({ roomInfo, roomHost, posts, setRoomInfo, setPosts }) {
  const router = useRouter();

  //pagination
  const [curPage, setCurPage] = useState(0);
  const [postsPerPage, setPostPerPage] = useState(10);
  const [totalPosts, setTotalPosts] = useState(0);
  const paginate = (pageNumber) => setCurPage(pageNumber);
  const onChangePostsPerPage = (event) => setPostPerPage(event.target.value);

  const params = {
    studyId: router.query.id,
    param: {
      page: curPage,
      size: postsPerPage,
    },
  };

  useEffect(() => {
    if (!router.isReady) return;
    getRoomInfo(
      router.query.id,
      (res) => {
        const roomData = {
          roomInfo: res.data.response,
          host: res.data.response.host,
          members: res.data.response.userDtos,
          comments: res.data.response.commentDtos.content,
        };
        setRoomInfo(roomData);
        console.log(res, "스터디 조회 성공");
      },
      (err) => {
        console.log(err, "스터디를 조회할 수 없습니다.");
      }
    );
    getPosts(
      params,
      (res) => {
        console.log(res, "공유글 조회 성공");
        const posts = res.data.response.content;
        setTotalPosts(res.data.response.totalElements);
        setPosts(posts);
      },
      (err) => {
        console.log(err, "공유글 조회 실패");
      }
    );
  }, [router.isReady]);

  useEffect(() => {
    getPosts(
      params,
      (res) => {
        console.log(res, "공유글 조회 성공");
        const posts = res.data.response.content;
        setTotalPosts(res.data.response.totalElements);
        setPosts(posts);
      },
      (err) => {
        console.log(err, "공유글 조회 실패");
      }
    );
  }, [curPage, postsPerPage]);

  return (
    <div className={styles.teamBoard}>
      <Layout
        roomInfo={roomInfo}
        host={roomHost.nickName}
        createdAt={roomInfo.createdAt}
        image={roomInfo.imageUrl}
        href={"/team/space/board/create"}
        btnText="글 작성하기"
      />

      <div className={styles.container}>
        <div className={styles.header}>
          <h3>정보를 공유해 주세요!</h3>
          <select onChange={onChangePostsPerPage}>
            <option value="10">10개씩 보기</option>
            <option value="20">20개씩 보기</option>
            <option value="30">30개씩 보기</option>
          </select>
        </div>

        <div className={styles.table}>
          <div className={styles.postHeader}>
            <span>작성일</span>
            <span>제목</span>
            <span>작성자</span>
          </div>

          <div className={styles.postList}>
            {posts?.map((post) => (
              <div className={styles.postRow} key={post.id}>
                <span>{post.createdAt.slice(0, 10)}</span>
                <span>
                  <Link
                    href={{
                      pathname: "/team/space/board/post",
                      query: {
                        id: router.query.id,
                        post: JSON.stringify({ post }),
                      },
                    }}
                    as={`/team/space/board/post/${router.query.id}`}
                  >
                    <a className={styles.title}>{post.title}</a>
                  </Link>
                </span>
                <span>{post.writer.nickName}</span>
              </div>
            ))}
          </div>
        </div>

        <Pagination
          curPage={curPage}
          paginate={paginate}
          totalCount={totalPosts}
          postsPerPage={postsPerPage}
        />
      </div>
    </div>
  );
}
