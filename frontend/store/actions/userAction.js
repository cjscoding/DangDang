import types from "../types";

export const setUserInfo = (userInfo) => ({
  type: types.SET_USERINFO,
  userInfo,
});

export const setShowModal = (show) => ({
  type: types.SET_SHOWMODAL,
  show,
});

export const setIsLogin = (isLogin) => ({
  type: types.SET_ISLOGIN,
  isLogin,
});
