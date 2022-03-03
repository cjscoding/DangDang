import { apiInstance } from "./index";

const api = apiInstance();

/** 회원 인증: 회원가입, 로그인, 로그아웃 */
export const signUpRequest = async (params, success, fail) => {
  await api.post(`/user`, params).then(success).catch(fail);
};

export const getToken = async (params, success, fail) => {
  await api.post(`/user/login`, params).then(success).catch(fail);
};

export const logoutRequest = async (success, fail) => {
  await api.post(`/user/logout`).then(success).catch(fail);
};

/** Social Login */
export const googleLoginRequest = async (success, fail) => {
  await api
    .get(
      `/oauth2/authorize/google?redirect_uri=http://localhost:3000/user/oauth2/redirect`
    )
    .then(success)
    .catch(fail);
};

/** 회원 정보 관리: 정보 얻어오기, 수정, 삭제 등 */
export const getUserInfo = async (success, fail) => {
  await api.get(`/user/me`).then(success).catch(fail);
};

export const modifyUserInfo = async (params, success, fail) => {
  await api.patch(`/user`, params).then(success).catch(fail);
};

//회원 탈퇴
export const leaveDangDang = async (success, fail) =>
  await api.delete("/user").then(success).catch(fail);

//회원 이미지 등록
export const registUserImage = async (req, success, fail) => {
  const formData = new FormData();
  formData.append("image", req);
  await api.post("/user/image", formData).then(success).catch(fail);
};

//회원 이미지 수정
export const updateUserImage = async (newImage, success, fail) => {
  const formData = new FormData();
  formData.append("image", newImage);
  await api.patch("/user/image", formData).then(success).catch(fail);
};
