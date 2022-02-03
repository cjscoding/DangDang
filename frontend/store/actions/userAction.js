import types from "../types";

export const setUserInfo = (userInfo) => ({
  type: types.SET_USERINFO,
  userInfo,
});

export const setShowModal = (show) => ({
  type: types.SET_SHOWMODAL,
  show,
});

export const setIsLoginModal = (isLoginModal) => ({
  type: types.SET_ISLOGINMODAL,
  isLoginModal,
});

export const resetUserInfo = () => ({
  type: types.RESET_USERINFO,
});
