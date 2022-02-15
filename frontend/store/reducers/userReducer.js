import types from "../types";
import { BACKEND_URL } from "../../config";

const initialState = {
  user: {
    id: "",
    email: "",
    nickName: "",
    role: "",
    imageUrl: `${BACKEND_URL}/files/images/default.png`,
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
      const user = {
        ...action.userInfo,
        imageUrl: action.userInfo.imageUrl.slice(0, 4) === "http"?action.userInfo.imageUrl:`${BACKEND_URL}/files/images/${action.userInfo.imageUrl}`
      }
      return { ...state, user: user };
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
          role: "",
          imageUrl: `${BACKEND_URL}/files/images/default.png`,
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
