import styles from "../../../../scss/team/space/teamspace.module.scss";
import Pagination from "../../../../components/team/board/pagination";
import Layout from "../../../../components/team/space/layout";
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

function Board({ roomInfo, roomHost, userInfo, posts, setRoomInfo, setPosts }) {
  const router = useRouter();

  //pagination
  const [curPage, setCurPage] = useState(0);
  const [postsPerPage] = useState(6);
  const [totalPosts, setTotalPosts] = useState(0);
  const paginate = (pageNumber) => setCurPage(pageNumber);

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
  }, [curPage]);

  return (
    <div>
      <Layout
        name={roomInfo.name}
        host={roomHost.nickName}
        createdAt={roomInfo.createdAt}
        image={roomInfo.imageUrl}
      />
      <div className={styles.container}>
        <h1>회사정보공유페이지</h1>
        <Link
          href={{
            pathname: "/team/space/board/create",
            query: {
              id: router.query.id,
            },
          }}
        >
          <a>글작성</a>
        </Link>
        <div className={styles.table}>
          <table>
            <thead>
              <tr className="">
                <th className="">제목</th>
                <th>작성자</th>
                <th>작성일</th>
              </tr>
            </thead>
            <tbody>
              {posts?.map((post, index) => (
                <tr key={index}>
                  <td>
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
                      <a>{post.title}</a>
                    </Link>
                  </td>
                  <td>{post.writer.nickName}</td>
                  <td>{post.createdAt.slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          paginate={paginate}
          totalCount={totalPosts}
          postsPerPage={postsPerPage}
        />
      </div>
    </div>
  );
}
