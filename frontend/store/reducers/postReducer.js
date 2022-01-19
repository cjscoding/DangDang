import * as types from "../types";
const initialState = {
  posts: [],
  hosts: [],
  post: {},
  rooms: [],
  myRooms: [],
  teamNos: [],
  loading: false,
  error: null,
};
export const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_POSTS:
      return {
        ...state,
        posts: action.payload,
        hosts: action.host,
        teamNos: action.teamNo,
        loading: false,
        error: null,
      };
    // case types.SET_TEAM_NO:
    //   return {
    //     ...state,
    //     teamNo: action.teamNo,
    //   };
    default:
      return state;
  }
};
export const roomReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_ROOMS:
      return {
        ...state,
        rooms: action.keywords,
      };
    default:
      return state;
  }
};
export const myRoomReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_MY_ROOMS:
      return {
        ...state,
        myRooms: action.keywords,
      };
    default:
      return state;
  }
};
