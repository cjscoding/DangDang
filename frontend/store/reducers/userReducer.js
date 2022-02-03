import types from "../types";

const initialState = {
  user: {
    id: "",
    email: "",
    nickName: "",
  },
  showModal: false,
  isLoginModal: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_USERINFO:
      return { ...state, user: { ...action.userInfo } };
    case types.SET_SHOWMODAL:
      return { ...state, showModal: action.show };
    case types.SET_ISLOGINMODAL:
      return { ...state, isLoginModal: action.isLoginModal };
    case types.RESET_USERINFO:
      return {
        user: {
          id: "",
          email: "",
          nickName: "",
        },
        showModal: false,
        isLoginModal: false,
      };
    default:
      return state;
  }
};

export default userReducer;
