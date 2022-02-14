import { setUserList } from "../../store/actions/adminAction";
import { getAllUserList } from "../../api/admin";
import { useEffect, useState } from "react";
import { connect } from "react-redux";

const mapStateToProps = (state) => {
  return {
    // userList: state.adminReducer.users,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUserList: (users) => dispatch(setUserList(users)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminUser);

function AdminUser() {
  return <div>user</div>;
}
