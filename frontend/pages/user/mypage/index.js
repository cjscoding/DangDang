import Link from "next/link";

import { connect } from "react-redux";
import { leaveDangDang } from "../../../api/user";
import { BACKEND_URL } from "../../../config";
import { useRouter } from "next/router";

function mapStateToProps({ userReducer }) {
  return {
    user: userReducer.user,
  };
}

export default connect(mapStateToProps)(userInfo);

function userInfo({ user }) {
  const router = useRouter();

  //회원 탈퇴
  const onLeaveDangDang = () => {
    leaveDangDang(
      (res) => {
        console.log(res, "당당 탈퇴 성공");
        router.push({
          pathname: "/",
        });
      },
      (err) => {
        console.log(err, "당당 탈퇴 실패");
      }
    );
  };

  return (
    <section>
      <div className="profileImage">
        <span>profile: </span>
        <img
          src={`${BACKEND_URL}/files/images/${user.imageUrl}`}
          width={200}
          height={100}
        />
      </div>
      <div className="profile">
        <p>id: {user.id}</p>
        <p>이름: {user.nickName}</p>
        <p>이메일: {user.email}</p>
        <Link href="/user/edit">
          <a>
            <button>변경</button>
          </a>
        </Link>
        <button onClick={onLeaveDangDang}>당당탈퇴</button>
      </div>
    </section>
  );
}
