import Link from "next/link";

import { connect } from "react-redux";
import { useState } from "react";
import { useRouter } from "next/router";
import { BACKEND_URL } from "../../../config";
import {
  setUserInfo,
  setIsLogin,
  resetUserInfo,
} from "../../../store/actions/userAction";
import {
  modifyUserInfo,
  logoutRequest,
  updateUserImage,
  getUserInfo,
} from "../../../api/user";

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
  const [image, setImage] = useState(user.imageUrl);
  const [imageUpdateStatus, setImageUpdateStatus] = useState(false);
  const [values, setValues] = useState({
    id: user.id,
    email: user.email,
    nickName: user.nickName,
    imageUrl: user.imageUrl,
    password: "",
  });

  const handleChange = ({ target: { id, value } }) => {
    const nextValues = {
      ...values,
      [id]: value,
    };
    setValues(nextValues);
  };

  const getAndModifyUserData = () => {
    getUserInfo(
      (res) => {
        console.log(res, "유저 정보 조회 성공");
        modifyUserInfo(
          values,
          ({ data: { response } }) => {
            const userInfo = {
              id: user.id,
              email: response.email,
              nickName: response.nickName,
              imageUrl: res.data.response.imageUrl,
            };
            setUserInfo(userInfo);
            router.push("/user/mypage");
          },
          (error) => console.log(error)
        );
        setImageUpdateStatus(false);
      },
      (err) => {
        console.log(err, "유저 정보 조회 실패");
      }
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (user.email === values.email) {
      if (imageUpdateStatus) {
        updateUserImage(
          image,
          (res) => {
            console.log(res, "유저 이미지 변경 성공");
            getAndModifyUserData();
          },
          (err) => {
            console.log(err, "유저 이미지 변경 실패");
          }
        );
      } else {
        getAndModifyUserData();
      }
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

  //유저 이미지 변경 모드로 전환
  const onChangeImage = () => setImageUpdateStatus(true);
  //유저 이미지 변경 시 state 값 변환
  const onSetImage = (event) => setImage(event.target.files[0]);

  return (
    <div>
      {imageUpdateStatus ? (
        <div className="profileImage">
          <label htmlFor="profile">프로필 사진</label>
          <input type="file" name="profile" onChange={onSetImage} />
        </div>
      ) : (
        <div className="profileImage">
          <span>profile: </span>
          <img
            src={`${BACKEND_URL}/files/images/${user.imageUrl}`}
            width={200}
            height={100}
          />
          <button onClick={onChangeImage}>이미지 변경</button>
        </div>
      )}
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
    </div>
  );
}
