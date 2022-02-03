import Link from "next/link";
import { connect } from "react-redux";

function mapStateToProps({ userReducer }) {
  return {
    user: userReducer.user,
  };
}

export default connect(mapStateToProps)(userInfo);

function userInfo({ user }) {
  return (
    <section>
      <div className="profileImage">프로필사진</div>
      <div className="profile">
        <p>id: {user.id}</p>
        <p>이름: {user.nickName}</p>
        <p>이메일: {user.email}</p>
        <Link href="/user/mypage/userInfoEdit" as="/user">
          <a>
            <button>변경</button>
          </a>
        </Link>
      </div>
    </section>
  );
}
