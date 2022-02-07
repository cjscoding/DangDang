import types from "../types";

const initialState = {
  user: {
    id: "",
    email: "",
    nickName: "",
  },
  isLogin: false,
  showModal: false,
  isLoginModal: false,
  isMoveTeamStudy: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_ISLOGIN:
      return { ...state, isLogin: action.isLogin };
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
    case types.MOVE_TEAMSTUDY:
      return { ...state, isMoveTeamStudy: action.isMoveTeamStudy };
    default:
      return state;
  }
};

export default userReducer;
