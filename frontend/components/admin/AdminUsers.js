import Pagination from "../../components/layout/Pagination";
import UserListRow from "./UserListRow";

import { setUserList } from "../../store/actions/adminAction";
import { getAllUserList } from "../../api/admin";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import styles from "../../scss/admin/container.module.scss";

const mapStateToProps = (state) => {
  return {
    users: state.adminReducer.users,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUsers: (users) => dispatch(setUserList(users)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminQuestion);

function AdminQuestion({ users, setUsers }) {
  //pagination
  const [curPage, setCurPage] = useState(0);
  const [postsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(users.totalElements);
  const paginate = (pageNumber) => setCurPage(pageNumber);

  useEffect(() => {
    const param = {
      page: curPage,
      size: postsPerPage,
    };
    getAllUserList(
      param,
      (res) => {
        console.log(res, "유저 리스트 조회 성공");
        setUsers(res.data.response.content);
        setTotalElements(res.data.response.totalElements);
      },
      (err) => console.log(err, "유저 리스트 조회 실패")
    );
  }, [curPage]);

  return (
    <div>
      <div>
        <div className={styles.menu}>
          <span>No.</span>
          <span>닉네임</span>
          <span>등급</span>
        </div>

        {users &&
          users.map((user) => <UserListRow key={user.id} user={user} />)}
      </div>

      <div className={styles.pagination}>
        <Pagination
          curPage={curPage}
          paginate={paginate}
          totalCount={totalElements}
          postsPerPage={postsPerPage}
        />
      </div>
    </div>
  );
}
