import types from "../types";

const initialState = {
  user: {
    email: "",
    nickName: "",
  },
  showModal: false,
  isLogin: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_USERINFO:
      return { ...state, user: { ...action.userInfo } };
    case types.SET_SHOWMODAL:
      return { ...state, showModal: action.show };
    case types.SET_ISLOGIN:
      return { ...state, isLogin: action.isLogin };
    case types.RESET_USERINFO:
      return {
        user: {
          email: "",
          nickName: "",
        },
        showModal: false,
        isLogin: false,
      };
    default:
      return state;
  }
};

export default userReducer;
