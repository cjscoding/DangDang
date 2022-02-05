import Link from "next/link";
import { connect } from "react-redux";
import { useState } from "react";
import { useRouter } from "next/router";
import {
  setUserInfo,
  setIsLogin,
  resetUserInfo,
} from "../../store/actions/userAction";
import { modifyUserInfo, logoutRequest } from "../../api/user";

function mapStateToProps({ userReducer }) {
  return {
    user: userReducer.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setUserInfo: (user) => dispatch(setUserInfo(user)),
    resetUserInfo: () => dispatch(resetUserInfo()),
    setIsLogin: (isLogin) => dispatch(setIsLogin(isLogin)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(userInfoEdit);

function userInfoEdit({ user, setUserInfo, resetUserInfo, setIsLogin }) {
  const router = useRouter();
  const [values, setValues] = useState({
    id: user.id,
    email: user.email,
    nickName: user.nickName,
    password: "",
  });

  const handleChange = ({ target: { id, value } }) => {
    const nextValues = {
      ...values,
      [id]: value,
    };
    setValues(nextValues);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (user.email === values.email) {
      modifyUserInfo(
        values,
        ({ data: { response } }) => {
          const userInfo = {
            id: user.id,
            email: response.email,
            nickName: response.nickName,
          };
          setUserInfo(userInfo);
          router.push("/user");
        },
        (error) => console.log(error)
      );
    } else {
      logoutRequest((response) => {
        modifyUserInfo(
          values,
          ({ data: { response } }) => {
            console.log(response);
            localStorage.removeItem("authorization");
            localStorage.removeItem("refreshtoken");

            // 로그아웃 시 삭제해야 하는 store 값들 추가로 삭제 바람!
            resetUserInfo();
            setIsLogin(false);
            alert(
              "이메일이 변경되었습니다. 변경된 이메일로 다시 로그인해주세요."
            );
            router.push("/");
          },
          (error) => console.log(error)
        );
      });
    }
  };

  return (
    <form method="POST" onSubmit={handleSubmit}>
      <div>
        <label>
          이메일:
          <input
            id="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            placeholder="변경할 이메일을 입력하세요"
            required
          />
        </label>
      </div>
      <div>
        <label>
          비밀번호:
          <input
            id="password"
            type="password"
            value={values.password}
            onChange={handleChange}
          />
        </label>
      </div>
      <div>
        <label>
          이름:
          <input
            id="nickName"
            type="text"
            value={values.nickName}
            onChange={handleChange}
            placeholder="변경할 이름을 입력하세요"
            required
          />
        </label>
      </div>
      {/* <Link href="/user"> */}
      <a>
        <button type="submit">확인</button>
      </a>
      {/* </Link> */}
      <Link href="/user">
        <a>
          <button>취소</button>
        </a>
      </Link>
    </form>
  );
}
