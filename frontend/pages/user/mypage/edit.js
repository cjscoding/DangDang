import styles from "../../../scss/user/update.module.scss";

import { connect } from "react-redux";
import { useState } from "react";
import { useRouter } from "next/router";
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
  const [image, setImage] = useState("");
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
              role: response.role,
              imageUrl: res.data.response.imageUrl,
            };
            setUserInfo(userInfo);
            router.push("/user/mypage");
          },
          (error) => console.log(error)
        );
      },
      (err) => {
        console.log(err, "유저 정보 조회 실패");
      }
    );
  };

  const updateData = () => {
    if (user.email === values.email) getAndModifyUserData();
    else {
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

  const handleSubmit = (event) => {
    event.preventDefault();
    if (image) {
      updateUserImage(
        image,
        (res) => {
          console.log(res, "유저 이미지 변경 성공");
          updateData();
        },
        (err) => {
          console.log(err, "유저 이미지 변경 실패");
        }
      );
    } else {
      updateData();
    }
  };

  //마이 페이지로 돌아가기
  const onMovePage = () => {
    router.push("/user/mypage");
  };

  //유저 이미지 변경 시 state 값 변환
  const onSetImage = (event) => setImage(event.target.files[0]);

  return (
    <div className={styles.updateContainer}>
      <button onClick={onMovePage} className={styles.backBtn}>
        <i className="fas fa-angle-double-left"></i> 돌아가기
      </button>

      <div className={styles.formContainer}>
        <form method="POST" onSubmit={handleSubmit}>
          <h2>내 정보 수정</h2>

          <div className={styles.info}>
            <label>이메일</label>
            <input
              id="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              placeholder="변경할 이메일을 입력하세요"
              autoFocus
              required
            />

            <label>비밀번호</label>
            <input
              id="password"
              type="password"
              value={values.password}
              onChange={handleChange}
            />

            <label>닉네임</label>
            <input
              id="nickName"
              type="text"
              value={values.nickName}
              onChange={handleChange}
              placeholder="변경할 이름을 입력하세요"
              required
            />

            <label htmlFor="profile">프로필 사진</label>
            <div className={styles.profileContainer}>
              <input
                type="file"
                id="inputFile"
                onChange={onSetImage}
                style={{ display: "none" }}
              />
              <span>{image ? image.name : null}</span>
              <label className={styles.inputFileButton} htmlFor="inputFile">
                등록
              </label>
            </div>
          </div>

          <button type="submit" className={styles.updateBtn}>
            수정
          </button>
        </form>
      </div>
    </div>
  );
}
